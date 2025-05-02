"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    findAllUser: ()=>findAllUser,
    searchUsers: ()=>searchUsers,
    findUserById: ()=>findUserById,
    createUser: ()=>createUser,
    updateUser: ()=>updateUser,
    changeUserRole: ()=>changeUserRole,
    deleteUser: ()=>deleteUser,
    changePassword: ()=>changePassword,
    getUsersCount: ()=>getUsersCount,
    getUserInvestmentData: ()=>getUserInvestmentData,
    getUserRole: ()=>getUserRole
});
const _bcryptjs = require("bcryptjs");
const _database = require("../database");
const _httpException = require("../exceptions/httpException");
const _sequelize = require("sequelize");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
async function findAllUser(options = {
    page: 0,
    pageCount: 25
}) {
    const queryOptions = {
        order: [
            [
                options.sortKey || 'id',
                options.sortOrder || 'desc'
            ]
        ]
    };
    if (options.pageCount !== undefined) {
        queryOptions.limit = options.pageCount;
        queryOptions.offset = options.page * options.pageCount;
    }
    const totalDocs = await _database.DB.User.count();
    const allUser = await _database.DB.User.findAll(queryOptions);
    const totalPages = Math.floor(totalDocs / options.pageCount);
    let hasPrevPage = false;
    let hasNextPage = false;
    let prevPage = null;
    let nextPage = null;
    if (totalPages > options.page) {
        hasNextPage = true;
        nextPage = options.page + 1;
    }
    if (options.page > 0) {
        hasPrevPage = true;
        prevPage = options.page - 1;
    }
    await Promise.all(allUser.map(async (user)=>{
        const UserInvestmentMeta = await getUserInvestmentData(user.dataValues.id);
        user.dataValues.userInvestmentAmount = UserInvestmentMeta.userInvestmentAmount;
        user.dataValues.userTokensSold = UserInvestmentMeta.userTokensSold;
        return user;
    }));
    const returnData = {
        data: allUser,
        totalDocs: totalDocs,
        totalPages: totalPages,
        page: options.page,
        pagingCounter: options.pageCount,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    };
    return returnData;
}
async function searchUsers(searchString, options = {
    page: 0,
    pageCount: 10
}) {
    const allUser = await _database.DB.User.findAll({
        where: {
            [_sequelize.Op.or]: [
                {
                    name: {
                        [_sequelize.Op.like]: `%${searchString}%`
                    }
                },
                {
                    email: {
                        [_sequelize.Op.like]: `%${searchString}%`
                    }
                }
            ]
        },
        limit: options.pageCount,
        offset: options.page * options.pageCount,
        order: options.order
    });
    return allUser;
}
async function findUserById(userId) {
    const findUser = await _database.DB.User.findByPk(userId);
    if (!findUser) throw new _httpException.HttpException(409, "User doesn't exist");
    return findUser;
}
async function createUser(userData) {
    const findUser = await _database.DB.User.findOne({
        where: {
            email: userData.email
        }
    });
    if (findUser) throw new _httpException.HttpException(409, `This email ${userData.email} already exists`);
    const hashedPassword = await (0, _bcryptjs.hash)(userData.password, 10);
    const createUserData = await _database.DB.User.create(_objectSpreadProps(_objectSpread({}, userData), {
        password: hashedPassword
    }));
    return createUserData;
}
async function updateUser(userId, userData) {
    const findUser = await _database.DB.User.findByPk(userId);
    if (!findUser) throw new _httpException.HttpException(409, "User doesn't exist");
    const hashedPassword = await (0, _bcryptjs.hash)(userData.password, 10);
    await _database.DB.User.update(_objectSpreadProps(_objectSpread({}, userData), {
        password: hashedPassword
    }), {
        where: {
            id: userId
        }
    });
    const updateUser = await _database.DB.User.findByPk(userId);
    return updateUser;
}
async function changeUserRole(userId, userRole) {
    await _database.DB.User.update({
        userRole: userRole
    }, {
        where: {
            id: userId
        }
    });
    return true;
}
async function deleteUser(userId) {
    const findUser = await _database.DB.User.findByPk(userId);
    if (!findUser) throw new _httpException.HttpException(409, "User doesn't exist");
    await _database.DB.User.destroy({
        where: {
            id: userId
        }
    });
    return findUser;
}
async function changePassword(userId, newPassword) {
    const findUser = await _database.DB.User.findByPk(userId);
    if (!findUser) throw new _httpException.HttpException(409, "User doesn't exist");
    const hashedPassword = await (0, _bcryptjs.hash)(newPassword, 10);
    const isPasswordMatching = await findUser.comparePassword(newPassword);
    if (isPasswordMatching) {
        throw new _httpException.HttpException(403, "New password can't be the current password");
    } else {
        const [updateUser] = await _database.DB.User.update({
            password: hashedPassword
        }, {
            where: {
                id: userId
            }
        });
        return updateUser[1];
    }
}
async function getUsersCount() {
    const totalUsers = await _database.DB.User.count();
    if (!totalUsers) throw new _httpException.HttpException(409, "No Users");
    return totalUsers;
}
async function getUserInvestmentData(userId) {
    const userInvestmentAmount = await _database.DB.Investment.sum('amount', {
        where: {
            [_sequelize.Op.and]: [
                {
                    userId: userId
                },
                {
                    txnStatus: 'approved'
                }
            ]
        }
    });
    const userTokensSold = await _database.DB.Investment.sum('tokenTransfered', {
        where: {
            [_sequelize.Op.and]: [
                {
                    userId: userId
                },
                {
                    txnStatus: 'approved'
                }
            ]
        }
    });
    return {
        userInvestmentAmount: userInvestmentAmount || 0,
        userTokensSold: userTokensSold || 0
    };
}
async function getUserRole(email) {
    const findUser = await _database.DB.User.findOne({
        where: {
            email: email
        }
    });
    return findUser.dataValues.userRole;
}

//# sourceMappingURL=users.service.js.map