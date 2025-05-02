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
    MetaModel: ()=>MetaModel,
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
let MetaModel = class MetaModel extends _sequelize.Model {
    constructor(...args){
        super(...args);
        _defineProperty(this, "id", void 0);
        _defineProperty(this, "meta_name", void 0);
        _defineProperty(this, "meta_value", void 0);
    }
};
function _default(sequelize) {
    MetaModel.init({
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: _sequelize.DataTypes.INTEGER
        },
        meta_name: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(255)
        },
        meta_value: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(45)
        }
    }, {
        tableName: 'meta',
        sequelize
    });
    return MetaModel;
}

//# sourceMappingURL=meta.model.js.map