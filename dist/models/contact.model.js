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
    ContactModel: ()=>ContactModel,
    default: ()=>_default
});
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
let ContactModel = class ContactModel extends _sequelize.Model {
    constructor(...args){
        super(...args);
        _defineProperty(this, "id", void 0);
        _defineProperty(this, "name", void 0);
        _defineProperty(this, "email", void 0);
        _defineProperty(this, "phone", void 0);
        _defineProperty(this, "subject", void 0);
        _defineProperty(this, "message", void 0);
        _defineProperty(this, "reply", void 0);
    }
};
function _default(sequelize) {
    ContactModel.init({
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: _sequelize.DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(255)
        },
        email: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(45)
        },
        phone: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(15)
        },
        subject: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(255)
        },
        message: {
            allowNull: false,
            type: _sequelize.DataTypes.TEXT()
        },
        reply: {
            allowNull: true,
            type: _sequelize.DataTypes.TEXT()
        }
    }, {
        tableName: 'contact',
        sequelize
    });
    return ContactModel;
}

//# sourceMappingURL=contact.model.js.map