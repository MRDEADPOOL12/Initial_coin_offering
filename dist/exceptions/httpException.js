"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HttpException", {
    enumerable: true,
    get: ()=>HttpException
});
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
let HttpException = class HttpException extends Error {
    constructor(status, message){
        super(message);
        _defineProperty(this, "status", void 0);
        _defineProperty(this, "message", void 0);
        this.status = status;
        this.message = message;
    }
};

//# sourceMappingURL=httpException.js.map