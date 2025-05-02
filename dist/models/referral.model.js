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
    ReferralModel: ()=>ReferralModel,
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
let ReferralModel = class ReferralModel extends _sequelize.Model {
    constructor(...args){
        super(...args);
        _defineProperty(this, "id", void 0);
        _defineProperty(this, "code", void 0);
        _defineProperty(this, "userId", void 0);
        _defineProperty(this, "createdAt", void 0);
        _defineProperty(this, "updatedAt", void 0);
    }
};
function _default(sequelize) {
    ReferralModel.init({
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: _sequelize.DataTypes.INTEGER
        },
        code: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(10)
        },
        userId: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER,
            references: {
                model: _usersModel.UserModel,
                key: 'id'
            }
        }
    }, {
        tableName: 'referral',
        sequelize
    });
    return ReferralModel;
}

//# sourceMappingURL=referral.model.js.map