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
    AdminAuthMiddleware: ()=>AdminAuthMiddleware,
    AuthMiddleware: ()=>AuthMiddleware
});
const _jsonwebtoken = require("jsonwebtoken");
const _config = require("../config");
const _database = require("../database");
const _httpException = require("../exceptions/httpException");
const _authService = require("../services/auth.service");
const _services = require("../services");
const getAuthorization = (req)=>{
    const cookie = req.cookies['access_token'];
    if (cookie) return cookie;
    const header = req.header('Authorization');
    if (header) return header.split('Bearer ')[1];
    return null;
};
const getRefreshToken = (req)=>{
    const header = req.header['refresh_token'];
    if (header) return header;
};
const AdminAuthMiddleware = async (req, res, next)=>{
    const userRole = await _services.UserService.getUserRole(req.body.email);
    if (userRole) {
        if (req.user.userRole <= 1) {
            next();
        } else {
            next(new _httpException.HttpException(401, 'Admin required'));
        }
    } else {
        next(new _httpException.HttpException(401, 'Unauthorized'));
    }
};
const AuthMiddleware = async (req, res, next)=>{
    try {
        const Authorization = getAuthorization(req);
        const refreshToken = getRefreshToken(req);
        console.log(Authorization);
        if (Authorization) {
            const params = (0, _jsonwebtoken.verify)(Authorization, _config.SECRET_KEY);
            const { id  } = params;
            const findUser = await _database.DB.User.findByPk(id);
            if (findUser) {
                req.user = findUser.dataValues;
                next();
            } else {
                next(new _httpException.HttpException(401, 'Wrong authentication token'));
            }
        } else if (refreshToken) {
            const { id  } = (0, _jsonwebtoken.verify)(refreshToken, _config.SECRET_KEY);
            const findUser = await _database.DB.User.findByPk(id);
            const accessToken = (0, _authService.createAccessToken)(findUser);
            const accessTokencookie = (0, _authService.createCookie)('access_token', accessToken);
            res.setHeader('Set-Cookie', [
                accessTokencookie
            ]);
            if (findUser) {
                req.user = findUser;
                next();
            } else {
                next(new _httpException.HttpException(401, 'Wrong authentication token'));
            }
        } else {
            next(new _httpException.HttpException(401, 'Authentication token missing'));
        }
    } catch (error) {
        next(new _httpException.HttpException(401, 'Wrong authentication token'));
    }
};

//# sourceMappingURL=auth.middleware.js.map