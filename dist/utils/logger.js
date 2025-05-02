"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "logger", {
    enumerable: true,
    get: ()=>logger
});
const _winston = _interopRequireDefault(require("winston"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let logTransports = [];
const logger = _winston.default.createLogger({
    level: 'silly',
    format: _winston.default.format.json(),
    defaultMeta: {
        service: 'user-service'
    },
    transports: [
        new _winston.default.transports.Console({
            format: _winston.default.format.simple()
        })
    ]
});

//# sourceMappingURL=logger.js.map