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
    WalletModel: ()=>WalletModel,
    default: ()=>_default
});
const _sequelize = require("sequelize");
const _usersModel = require("./users.model");
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
let WalletModel = class WalletModel extends _sequelize.Model {
    constructor(...args){
        super(...args);
        _defineProperty(this, "nonce", void 0);
        _defineProperty(this, "id", void 0);
        _defineProperty(this, "walletAddress", void 0);
        _defineProperty(this, "userId", void 0);
        _defineProperty(this, "verified", void 0);
        _defineProperty(this, "createdAt", void 0);
        _defineProperty(this, "updatedAt", void 0);
    }
};
function _default(sequelize) {
    WalletModel.init({
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: _sequelize.DataTypes.INTEGER
        },
        nonce: {
            type: _sequelize.DataTypes.STRING(50)
        },
        walletAddress: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(50),
            unique: true
        },
        userId: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER,
            references: {
                model: _usersModel.UserModel,
                key: 'id'
            }
        },
        verified: {
            allowNull: false,
            type: _sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'wallet',
        sequelize
    });
    return WalletModel;
}

//# sourceMappingURL=wallet.model.js.map