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
    listenApp: ()=>listenApp,
    connectToDatabase: ()=>connectToDatabase,
    initializeMiddlewares: ()=>initializeMiddlewares,
    initializeRoutes: ()=>initializeRoutes,
    initializeSwagger: ()=>initializeSwagger,
    initializeErrorHandling: ()=>initializeErrorHandling,
    default: ()=>initializeApp
});
require("reflect-metadata");
const _compression = _interopRequireDefault(require("compression"));
const _cookieParser = _interopRequireDefault(require("cookie-parser"));
const _cors = _interopRequireDefault(require("cors"));
const _express = _interopRequireDefault(require("express"));
const _helmet = _interopRequireDefault(require("helmet"));
const _hpp = _interopRequireDefault(require("hpp"));
const _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));
const _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
const _config = require("./config");
const _database = require("./database");
const _errorMiddleware = require("./middlewares/error.middleware");
const _logger = require("./utils/logger");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function listenApp(app, port, env) {
    app.listen(port, ()=>{
        _logger.logger.info(`=================================`);
        _logger.logger.info(`======= ENV: ${env} =======`);
        _logger.logger.info(`🚀 App listening on the port ${port}`);
        _logger.logger.info(`=================================`);
    });
}
function connectToDatabase() {
    _database.DB.sequelize.sync().then(()=>{
        _logger.logger.info('DB synced');
    }).catch((e)=>{
        _logger.logger.error('DB sync failed', e);
    });
    _logger.logger.info('DB connected');
}
function initializeMiddlewares(app) {
    _logger.logger.info('Start Middlewares');
    app.use((0, _cors.default)({
        origin: _config.ORIGIN,
        credentials: _config.CREDENTIALS
    }));
    app.use((0, _hpp.default)());
    app.use((0, _helmet.default)());
    app.use((0, _compression.default)());
    app.use(_express.default.json());
    app.use(_express.default.urlencoded({
        extended: true
    }));
    app.use((0, _cookieParser.default)());
    _logger.logger.info('Initialized Middlewares');
}
function initializeRoutes(app, routes) {
    routes.forEach((route)=>{
        app.use('/', route.router);
    });
    app.use('/static', _express.default.static(__dirname + '/public'));
    _logger.logger.debug('Initialized Routes');
}
function initializeSwagger(app) {
    const options = {
        swaggerDefinition: {
            info: {
                title: 'REST API',
                version: '1.0.0',
                description: 'Example docs'
            }
        },
        apis: [
            `${__dirname}/swagger/*.yaml`
        ]
    };
    const specs = (0, _swaggerJsdoc.default)(options);
    app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(specs));
    _logger.logger.debug('Initialized Swagger');
}
function initializeErrorHandling(app) {
    app.use(_errorMiddleware.ErrorMiddleware);
    _logger.logger.debug('Initialized Error Handling');
}
function initializeApp(app, routes) {
    try {
        connectToDatabase();
        initializeMiddlewares(app);
        initializeRoutes(app, routes);
        initializeSwagger(app);
        initializeErrorHandling(app);
    } catch (e) {
        _logger.logger.error(e);
    }
    return app;
}

//# sourceMappingURL=app.js.map