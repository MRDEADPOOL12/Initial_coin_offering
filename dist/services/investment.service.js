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
    createInvestment: ()=>createInvestment,
    updateInvestment: ()=>updateInvestment,
    deleteInvestment: ()=>deleteInvestment,
    batchUpdateTransactionHash: ()=>batchUpdateTransactionHash,
    batchUpdateTransactionHashv2: ()=>batchUpdateTransactionHashv2,
    findAllInvestments: ()=>findAllInvestments,
    findAllInvestmentsByUserId: ()=>findAllInvestmentsByUserId,
    findAllInvestmentByWalletId: ()=>findAllInvestmentByWalletId,
    findAllInvestmentByMinted: ()=>findAllInvestmentByMinted,
    getInvestmentMeta: ()=>getInvestmentMeta,
    investmentPagination: ()=>investmentPagination
});
const _database = require("../database");
const _httpException = require("../exceptions/httpException");
const _usersModel = require("../models/users.model");
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
async function createInvestment(investmentData) {
    const createInvestmentData = await _database.DB.Investment.create(investmentData);
    return createInvestmentData;
}
async function updateInvestment(investmentId, investmentData) {
    const findInvestment = await _database.DB.Investment.findByPk(investmentId);
    if (!findInvestment) throw new _httpException.HttpException(409, "Investment doesn't exist");
    await _database.DB.Investment.update(_objectSpread({}, investmentData), {
        where: {
            id: investmentId
        }
    });
    return true;
}
async function deleteInvestment(investmentId) {
    const findInvestment = await _database.DB.Investment.findByPk(investmentId);
    if (!findInvestment) throw new _httpException.HttpException(409, "Investment doesn't exist");
    await _database.DB.Investment.destroy({
        where: {
            id: investmentId
        }
    });
    return findInvestment;
}
async function batchUpdateTransactionHash(transactionHashs, params) {
    const { tokenTransfered , isTokenMinted , txnStatus  } = params;
    await _database.DB.Investment.update({
        tokenTransfered,
        isTokenMinted,
        txnStatus
    }, {
        where: {
            txnHash: transactionHashs
        }
    });
    return true;
}
async function batchUpdateTransactionHashv2(params) {
    const transactions = Object.entries(params).map(([txnHash, { tokenTransfered , isTokenMinted , txnStatus  }])=>_database.DB.Investment.update({
            tokenTransfered,
            isTokenMinted,
            txnStatus
        }, {
            where: {
                txnHash
            }
        }));
    await Promise.all(transactions);
    return true;
}
async function findAllInvestments(options = {
    page: 0,
    pageCount: 25
}) {
    const queryOptions = {
        order: [
            [
                options.sortKey || 'id',
                options.sortOrder || 'desc'
            ]
        ],
        include: [
            {
                model: _usersModel.UserModel,
                as: 'user',
                attributes: [
                    'email'
                ]
            }
        ]
    };
    if (options.pageCount !== undefined) {
        queryOptions.limit = options.pageCount;
        queryOptions.offset = options.page * options.pageCount;
    }
    const allInvestments = await _database.DB.Investment.findAll(queryOptions);
    const totalDocs = await _database.DB.Investment.count();
    const totalPages = Math.floor(totalDocs / options.pageCount);
    const finaldata = investmentPagination(allInvestments, totalDocs, totalPages, options.page, options.pageCount);
    return finaldata;
}
async function findAllInvestmentsByUserId(options = {
    page: 0,
    pageCount: 25,
    userId: 0
}) {
    const queryOptions = {
        where: {
            userId: options.userId
        },
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
    const allInvestments = await _database.DB.Investment.findAll(queryOptions);
    const totalDocs = await _database.DB.Investment.count({
        where: {
            userId: options.userId
        }
    });
    const totalPages = Math.floor(totalDocs / options.pageCount);
    const finaldata = investmentPagination(allInvestments, totalDocs, totalPages, options.page, options.pageCount);
    return finaldata;
}
async function findAllInvestmentByWalletId(options = {
    page: 0,
    pageCount: 10,
    walletId: 0
}) {
    const allInvestments = await _database.DB.Investment.findAll({
        where: {
            walletId: options.walletId
        },
        limit: options.pageCount,
        offset: options.page * options.pageCount,
        order: [
            [
                options.sortKey,
                options.sortOrder
            ]
        ]
    });
    const totalDocs = await _database.DB.Investment.count({
        where: {
            walletId: options.walletId
        }
    });
    const totalPages = Math.floor(totalDocs / options.pageCount);
    const finaldata = investmentPagination(allInvestments, totalDocs, totalPages, options.page, options.pageCount);
    return finaldata;
}
async function findAllInvestmentByMinted(options = {
    page: 0,
    pageCount: 25
}) {
    const queryOptions = {
        where: {
            isTokenMinted: false
        },
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
    const allInvestments = await _database.DB.Investment.findAll(queryOptions);
    const totalDocs = await _database.DB.Investment.count({
        where: {
            isTokenMinted: false
        }
    });
    const totalPages = Math.floor(totalDocs / options.pageCount);
    const finaldata = investmentPagination(allInvestments, totalDocs, totalPages, options.page, options.pageCount);
    return finaldata;
}
async function getInvestmentMeta() {
    const investmentAmount = await _database.DB.Investment.sum('amount', {
        where: {
            txnStatus: 'approved'
        }
    });
    const tokensSold = await _database.DB.Investment.sum('tokenTransfered', {
        where: {
            txnStatus: 'approved'
        }
    });
    return {
        investmentAmount: investmentAmount || 0,
        tokensSold: tokensSold || 0
    };
}
async function investmentPagination(allInvestments, totalDocs, totalPages, optionpage, optionpageCount) {
    let hasPrevPage = false;
    let hasNextPage = false;
    let prevPage = null;
    let nextPage = null;
    if (totalPages > optionpage) {
        hasNextPage = true;
        nextPage = optionpage + 1;
    }
    if (optionpage > 0) {
        hasPrevPage = true;
        prevPage = optionpage - 1;
    }
    const returnData = {
        data: allInvestments,
        totalDocs: totalDocs,
        totalPages: totalPages,
        page: optionpage,
        pagingCounter: optionpageCount,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    };
    return returnData;
}

//# sourceMappingURL=investment.service.js.map