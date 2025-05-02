"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DB", {
    enumerable: true,
    get: ()=>DB
});
const _sequelize = _interopRequireDefault(require("sequelize"));
const _config = require("../config");
const _usersModel = _interopRequireDefault(require("../models/users.model"));
const _contactModel = _interopRequireDefault(require("../models/contact.model"));
const _logger = require("../utils/logger");
const _referralModel = _interopRequireDefault(require("../models/referral.model"));
const _walletModel = _interopRequireDefault(require("../models/wallet.model"));
const _investmentModel = _interopRequireDefault(require("../models/investment.model"));
const _metaModel = _interopRequireDefault(require("../models/meta.model"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const sequelize = new _sequelize.default.Sequelize(_config.DB_DATABASE, _config.DB_USER, _config.DB_PASSWORD, {
    dialect: 'mysql',
    host: _config.DB_HOST,
    port: parseInt(_config.DB_PORT),
    timezone: '+05:30',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        underscored: true,
        freezeTableName: true
    },
    pool: {
        min: 0,
        max: 5
    },
    logQueryParameters: _config.NODE_ENV === 'development',
    logging: (query, time)=>{
        _logger.logger.info(time + 'ms' + ' ' + query);
    },
    benchmark: true
});
try {
    sequelize.authenticate().then(()=>{
        _logger.logger.debug('DB connection established');
    });
} catch (e) {
    _logger.logger.log(e);
}
const DB = {
    User: (0, _usersModel.default)(sequelize),
    Contact: (0, _contactModel.default)(sequelize),
    Referral: (0, _referralModel.default)(sequelize),
    Wallet: (0, _walletModel.default)(sequelize),
    Investment: (0, _investmentModel.default)(sequelize),
    Meta: (0, _metaModel.default)(sequelize),
    sequelize,
    Sequelize: _sequelize.default
};

//# sourceMappingURL=index.js.map