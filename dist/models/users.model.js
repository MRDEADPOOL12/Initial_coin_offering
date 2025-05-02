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
    UserModel: ()=>UserModel,
    default: ()=>_default
});
const _sequelize = require("sequelize");
const _bcryptjs = require("bcryptjs");
const _lodash = _interopRequireDefault(require("lodash"));
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let UserModel = class UserModel extends _sequelize.Model {
    getPublicData() {
        return _lodash.default.omit(this.get(), [
            'password',
            'emailOtp',
            'phoneOtp'
        ]);
    }
    constructor(...args){
        super(...args);
        _defineProperty(this, "id", void 0);
        _defineProperty(this, "email", void 0);
        _defineProperty(this, "password", void 0);
        _defineProperty(this, "emailOtp", void 0);
        _defineProperty(this, "phoneOtp", void 0);
        _defineProperty(this, "isEmailVerified", void 0);
        _defineProperty(this, "isPhoneVerified", void 0);
        _defineProperty(this, "invested", void 0);
        _defineProperty(this, "wpViewed", void 0);
        _defineProperty(this, "wpDownloaded", void 0);
        _defineProperty(this, "userRole", void 0);
        _defineProperty(this, "phone", void 0);
        _defineProperty(this, "name", void 0);
        _defineProperty(this, "referrerId", void 0);
        _defineProperty(this, "createdAt", void 0);
        _defineProperty(this, "updatedAt", void 0);
        _defineProperty(this, "comparePassword", async (inputPass)=>{
            await this.reload({
                attributes: {
                    include: [
                        'password'
                    ]
                }
            });
            return await (0, _bcryptjs.compare)(inputPass, this.dataValues.password);
        });
        _defineProperty(this, "compareEmailOtp", (otpInput)=>{
            console.log(otpInput, this.dataValues.emailOtp);
            console.log(otpInput, this);
            return otpInput === this.dataValues.emailOtp;
        });
        _defineProperty(this, "comparePhoneOtp", (otpInput)=>{
            return otpInput === this.dataValues.phoneOtp;
        });
    }
};
function _default(sequelize) {
    UserModel.init({
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: _sequelize.DataTypes.INTEGER
        },
        referrerId: {
            allowNull: true,
            type: _sequelize.DataTypes.INTEGER,
            references: {
                model: UserModel,
                key: 'id'
            }
        },
        name: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(45)
        },
        email: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(45)
        },
        password: {
            allowNull: true,
            type: _sequelize.DataTypes.STRING(255)
        },
        emailOtp: {
            allowNull: true,
            type: _sequelize.DataTypes.STRING(10)
        },
        phoneOtp: {
            allowNull: true,
            type: _sequelize.DataTypes.STRING(10)
        },
        isEmailVerified: {
            allowNull: false,
            type: _sequelize.DataTypes.BOOLEAN(),
            defaultValue: false
        },
        isPhoneVerified: {
            allowNull: false,
            type: _sequelize.DataTypes.BOOLEAN(),
            defaultValue: false
        },
        phone: {
            allowNull: true,
            type: _sequelize.DataTypes.STRING(15)
        },
        userRole: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER,
            defaultValue: 5
        },
        wpViewed: {
            allowNull: false,
            type: _sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        },
        wpDownloaded: {
            allowNull: false,
            type: _sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        },
        invested: {
            allowNull: false,
            type: _sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'user',
        sequelize,
        defaultScope: {
            attributes: {
                exclude: [
                    'password',
                    'emailOtp',
                    'phoneOtp'
                ]
            }
        }
    });
    return UserModel;
}

//# sourceMappingURL=users.model.js.map