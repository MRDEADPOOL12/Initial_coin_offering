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
    InvestmentModel: ()=>InvestmentModel,
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
let InvestmentModel = class InvestmentModel extends _sequelize.Model {
    constructor(...args){
        super(...args);
        _defineProperty(this, "walletAddress", void 0);
        _defineProperty(this, "id", void 0);
        _defineProperty(this, "userId", void 0);
        _defineProperty(this, "txnHash", void 0);
        _defineProperty(this, "amount", void 0);
        _defineProperty(this, "currency", void 0);
        _defineProperty(this, "tokenTransfered", void 0);
        _defineProperty(this, "txnStatus", void 0);
        _defineProperty(this, "isTokenMinted", void 0);
        _defineProperty(this, "mintTxnHash", void 0);
        _defineProperty(this, "transferWalletAddr", void 0);
        _defineProperty(this, "referralCode", void 0);
        _defineProperty(this, "txn_chain", void 0);
        _defineProperty(this, "createdAt", void 0);
        _defineProperty(this, "updatedAt", void 0);
        _defineProperty(this, "user", void 0);
    }
};
function _default(sequelize) {
    InvestmentModel.init({
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: _sequelize.DataTypes.INTEGER
        },
        userId: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER,
            references: {
                model: _usersModel.UserModel,
                key: 'id'
            }
        },
        walletAddress: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(50)
        },
        txnHash: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(255),
            unique: true
        },
        amount: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        },
        currency: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(50)
        },
        tokenTransfered: {
            allowNull: true,
            type: _sequelize.DataTypes.BOOLEAN
        },
        txnStatus: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(50)
        },
        isTokenMinted: {
            allowNull: false,
            type: _sequelize.DataTypes.BOOLEAN,
            defaultValue: true
        },
        mintTxnHash: {
            allowNull: true,
            type: _sequelize.DataTypes.STRING(50)
        },
        transferWalletAddr: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(50)
        },
        referralCode: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(50)
        },
        txn_chain: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(50)
        }
    }, {
        tableName: 'investment',
        sequelize
    });
    InvestmentModel.belongsTo(_usersModel.UserModel, {
        foreignKey: 'userId',
        as: 'user'
    });
    return InvestmentModel;
}

//# sourceMappingURL=investment.model.js.map