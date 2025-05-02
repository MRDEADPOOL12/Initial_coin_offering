"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "handler", {
    enumerable: true,
    get: ()=>handler
});
const _app = _interopRequireWildcard(require("./app"));
const _authRoute = _interopRequireDefault(require("./routes/auth.route"));
const _usersRoute = _interopRequireDefault(require("./routes/users.route"));
const _contactRoute = _interopRequireDefault(require("./routes/contact.route"));
const _validateEnv = require("./utils/validateEnv");
const _config = require("./config/index");
const _express = _interopRequireDefault(require("express"));
const _investmentRoute = _interopRequireDefault(require("./routes/investment.route"));
const _walletRoute = _interopRequireDefault(require("./routes/wallet.route"));
const _serverlessHttp = _interopRequireDefault(require("serverless-http"));
const _metaRoute = _interopRequireDefault(require("./routes/meta.route"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
(0, _validateEnv.ValidateEnv)();
const env = _config.NODE_ENV || 'development';
const port = _config.PORT || 3000;
const app = (0, _express.default)();
try {
    (0, _app.default)(app, [
        _authRoute.default,
        _usersRoute.default,
        _contactRoute.default,
        _investmentRoute.default,
        _walletRoute.default,
        _metaRoute.default
    ]);
    if (env == "local") (0, _app.listenApp)(app, port, env);
} catch (e) {
    console.log(e);
}
const handler = (0, _serverlessHttp.default)(app);

//# sourceMappingURL=server.js.map