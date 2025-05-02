import { Router } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AdminAuthMiddleware, AuthMiddleware } from '@/middlewares/auth.middleware';
import { UserController } from '@/controllers';

export const path = '/users';
export const router = Router();

router.get(`${path}`, AuthMiddleware, UserController.getUsers);
router.get(`${path}/:id(\\d+)`, AuthMiddleware, UserController.getUserById);
router.get(`${path}/profile`, AuthMiddleware, UserController.getProfile);
router.put(`${path}/:id(\\d+)`, ValidationMiddleware(CreateUserDto, true), AuthMiddleware, AdminAuthMiddleware, UserController.updateUser);
router.delete(`${path}/:id(\\d+)`, AuthMiddleware, AdminAuthMiddleware, UserController.deleteUser);
router.put(`${path}/update/:id(\\d+)`, AuthMiddleware, UserController.changePassword);
router.put(`${path}/update/role/:id(\\d+)`, AuthMiddleware, UserController.changeUserRole);
router.get(`${path}/search`, AuthMiddleware, UserController.searchUsers);

const UserRouter = {
  path: path,
  router: router,
};
export default UserRouter;
