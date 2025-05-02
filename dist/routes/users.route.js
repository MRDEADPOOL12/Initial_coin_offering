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
    path: ()=>path,
    router: ()=>router,
    default: ()=>_default
});
const _express = require("express");
const _usersDto = require("../dtos/users.dto");
const _validationMiddleware = require("../middlewares/validation.middleware");
const _authMiddleware = require("../middlewares/auth.middleware");
const _controllers = require("../controllers");
const path = '/users';
const router = (0, _express.Router)();
router.get(`${path}`, _authMiddleware.AuthMiddleware, _controllers.UserController.getUsers);
router.get(`${path}/:id(\\d+)`, _authMiddleware.AuthMiddleware, _controllers.UserController.getUserById);
router.get(`${path}/profile`, _authMiddleware.AuthMiddleware, _controllers.UserController.getProfile);
router.put(`${path}/:id(\\d+)`, (0, _validationMiddleware.ValidationMiddleware)(_usersDto.CreateUserDto, true), _authMiddleware.AuthMiddleware, _authMiddleware.AdminAuthMiddleware, _controllers.UserController.updateUser);
router.delete(`${path}/:id(\\d+)`, _authMiddleware.AuthMiddleware, _authMiddleware.AdminAuthMiddleware, _controllers.UserController.deleteUser);
router.put(`${path}/update/:id(\\d+)`, _authMiddleware.AuthMiddleware, _controllers.UserController.changePassword);
router.put(`${path}/update/role/:id(\\d+)`, _authMiddleware.AuthMiddleware, _controllers.UserController.changeUserRole);
router.get(`${path}/search`, _authMiddleware.AuthMiddleware, _controllers.UserController.searchUsers);
const UserRouter = {
    path: path,
    router: router
};
const _default = UserRouter;

//# sourceMappingURL=users.route.js.map