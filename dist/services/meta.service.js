"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findMetaData", {
    enumerable: true,
    get: ()=>findMetaData
});
const _database = require("../database");
const _sequelize = require("sequelize");
async function findMetaData() {
    const metaValues = await _database.DB.Meta.findAll({
        where: {
            [_sequelize.Op.or]: [
                {
                    id: 1
                },
                {
                    id: 2
                },
                {
                    id: 3
                },
                {
                    id: 4
                },
                {
                    id: 5
                }
            ]
        },
        attributes: [
            'meta_name',
            'meta_value'
        ],
        raw: true
    });
    const metaDataMap = {};
    metaValues.forEach((meta)=>{
        metaDataMap[meta.meta_name] = meta.meta_value;
    });
    return metaDataMap;
}

//# sourceMappingURL=meta.service.js.map