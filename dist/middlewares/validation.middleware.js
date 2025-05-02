"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ValidationMiddleware", {
    enumerable: true,
    get: ()=>ValidationMiddleware
});
const _classTransformer = require("class-transformer");
const _classValidator = require("class-validator");
const _httpException = require("../exceptions/httpException");
const ValidationMiddleware = (type, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false)=>{
    return (req, res, next)=>{
        const dto = (0, _classTransformer.plainToInstance)(type, req.body);
        (0, _classValidator.validateOrReject)(dto, {
            skipMissingProperties,
            whitelist,
            forbidNonWhitelisted
        }).then(()=>{
            req.body = dto;
            next();
        }).catch((errors)=>{
            const message = errors.map((error)=>Object.values(error.constraints)).join(', ');
            next(new _httpException.HttpException(400, message));
        });
    };
};

//# sourceMappingURL=validation.middleware.js.map