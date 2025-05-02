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
    getUsers: ()=>getUsers,
    searchUsers: ()=>searchUsers,
    getUserById: ()=>getUserById,
    getProfile: ()=>getProfile,
    createUser: ()=>createUser,
    updateUser: ()=>updateUser,
    changeUserRole: ()=>changeUserRole,
    deleteUser: ()=>deleteUser,
    changePassword: ()=>changePassword
});
const _services = require("../services");
const getUsers = async (req, res, next)=>{
    try {
        const findAllUsersData = await _services.UserService.findAllUser({
            page: parseInt(req.query.page ? req.query.page.toString() : '0'),
            pageCount: req.query.pageCount ? parseInt(req.query.pageCount.toString()) : undefined,
            sortKey: req.query.sortKey || 'id',
            sortOrder: req.query.sortOrder || 'desc'
        });
        res.status(200).json({
            data: findAllUsersData,
            message: 'findAll'
        });
    } catch (error) {
        next(error);
    }
};
const searchUsers = async (req, res, next)=>{
    try {
        const data = req.query.searchString;
        const order = [];
        if (req.query.orderKeys && req.query.orderValues) {
            const orderKeys = req.query.orderKeys.toString().split(',');
            const orderValues = req.query.orderValues.toString().split(',');
            if (orderKeys.length == orderValues.length) {
                orderKeys.forEach((k, ind)=>{
                    if (orderValues[ind] == 'DESC' || orderValues[ind] == 'ASC') {
                        order.push([
                            k,
                            orderValues[ind]
                        ]);
                    }
                });
            }
        }
        const findAllUsersData = await _services.UserService.searchUsers(data, {
            page: parseInt(req.query.page ? req.query.page.toString() : '0'),
            pageCount: parseInt(req.query.pageCount ? req.query.pageCount.toString() : '10'),
            order: order
        });
        res.status(200).json({
            data: findAllUsersData,
            message: 'Search User'
        });
    } catch (error) {
        next(error);
    }
};
const getUserById = async (req, res, next)=>{
    try {
        const userId = Number(req.params.id);
        const findOneUserData = await _services.UserService.findUserById(userId);
        res.status(200).json({
            data: findOneUserData,
            message: 'findOne'
        });
    } catch (error) {
        next(error);
    }
};
const getProfile = async (req, res, next)=>{
    try {
        const userId = Number(req.user.id);
        const findOneUserData = await _services.UserService.findUserById(userId);
        res.status(200).json({
            data: findOneUserData,
            message: 'findOne'
        });
    } catch (error) {
        next(error);
    }
};
const createUser = async (req, res, next)=>{
    try {
        const userData = req.body;
        const createUserData = await _services.UserService.createUser(userData);
        res.status(201).json({
            data: createUserData,
            message: 'created'
        });
    } catch (error) {
        next(error);
    }
};
const updateUser = async (req, res, next)=>{
    try {
        const userId = Number(req.params.id);
        const userData = req.body;
        const updateUserData = await _services.UserService.updateUser(userId, userData);
        res.status(200).json({
            data: updateUserData,
            message: 'updated'
        });
    } catch (error) {
        next(error);
    }
};
const changeUserRole = async (req, res, next)=>{
    try {
        const newUserRole = req.body.id;
        const userId = Number(req.params.id);
        if (newUserRole === 1 && req.user.userRole !== 0) {
            throw new Error('Super admin required');
        }
        const success = await _services.UserService.changeUserRole(userId, newUserRole);
        res.status(200).json({
            success,
            message: 'updated'
        });
    } catch (error) {
        next(error);
    }
};
const deleteUser = async (req, res, next)=>{
    try {
        const userId = Number(req.params.id);
        const deleteUserData = await _services.UserService.deleteUser(userId);
        res.status(200).json({
            data: deleteUserData,
            message: 'deleted'
        });
    } catch (error) {
        next(error);
    }
};
const changePassword = async (req, res, next)=>{
    try {
        const userId = Number(req.params.id);
        const password = String(req.body.password);
        const updatedUser = await _services.UserService.changePassword(userId, password);
        res.status(200).json({
            data: updatedUser,
            message: 'updated'
        });
    } catch (error) {
        next(error);
    }
};

//# sourceMappingURL=users.controller.js.map