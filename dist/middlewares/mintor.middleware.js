"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MintorAuthMiddleware", {
    enumerable: true,
    get: ()=>MintorAuthMiddleware
});
const _httpException = require("../exceptions/httpException");
const _services = require("../services");
const MintorAuthMiddleware = async (req, res, next)=>{
    try {
        const userRole = await _services.UserService.getUserRole(req.body.email);
        if (userRole) {
            if (userRole === 2 || userRole === 1) {
                next();
            } else {
                next(new _httpException.HttpException(401, 'Mentor or Admin required'));
            }
        } else {
            next(new _httpException.HttpException(401, 'Unauthorized'));
        }
    } catch (error) {
        next(new _httpException.HttpException(500, 'user not found'));
    }
};

//# sourceMappingURL=mintor.middleware.js.map