"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VipAuthMiddleware", {
    enumerable: true,
    get: ()=>VipAuthMiddleware
});
const _httpException = require("../exceptions/httpException");
const _services = require("../services");
const VipAuthMiddleware = async (req, res, next)=>{
    try {
        const userRole = await _services.UserService.getUserRole(req.body.email);
        if (userRole) {
            if (userRole === 3 || userRole === 1) {
                next();
            } else {
                next(new _httpException.HttpException(403, 'VIP required'));
            }
        } else {
            next(new _httpException.HttpException(403, 'Unauthorized'));
        }
    } catch (error) {
        next(new _httpException.HttpException(403, 'user not found'));
    }
};

//# sourceMappingURL=vip.middleware.js.map