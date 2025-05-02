import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UserService } from '@/services';
import { RequestWithUser } from '@/interfaces/auth.interface';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const findAllUsersData: Omit<User, 'password' | 'emailOtp' | 'phoneOtp'>[] = await UserService.findAllUser({
      page: parseInt(req.query.page ? req.query.page.toString() : '0'),
      pageCount : req.query.pageCount ? parseInt(req.query.pageCount.toString()) : undefined,
      sortKey : req.query.sortKey || 'id',
      sortOrder : req.query.sortOrder || 'desc'
    });

    res.status(200).json({ data: findAllUsersData, message: 'findAll' });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: string = req.query.searchString as string;
    const order: [string, string][] = [];
    if (req.query.orderKeys && req.query.orderValues) {
      const orderKeys = req.query.orderKeys.toString().split(',');
      const orderValues = req.query.orderValues.toString().split(',');
      if (orderKeys.length == orderValues.length) {
        orderKeys.forEach((k, ind) => {
          if (orderValues[ind] == 'DESC' || orderValues[ind] == 'ASC') {
            order.push([k, orderValues[ind]]);
          }
        });
      }
    }
    const findAllUsersData: Omit<User, 'password' | 'emailOtp' | 'phoneOtp'>[] = await UserService.searchUsers(data, {
      page: parseInt(req.query.page ? req.query.page.toString() : '0'),
      pageCount: parseInt(req.query.pageCount ? req.query.pageCount.toString() : '10'),
      order: order,
    });

    res.status(200).json({ data: findAllUsersData, message: 'Search User' });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    const findOneUserData: User = await UserService.findUserById(userId);

    res.status(200).json({ data: findOneUserData, message: 'findOne' });
  } catch (error) {
    next(error);
  }
};
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.user.id);
    const findOneUserData: User = await UserService.findUserById(userId);

    res.status(200).json({ data: findOneUserData, message: 'findOne' });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: CreateUserDto = req.body;
    const createUserData: User = await UserService.createUser(userData);

    res.status(201).json({ data: createUserData, message: 'created' });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    const userData: CreateUserDto = req.body;
    const updateUserData: User = await UserService.updateUser(userId, userData);

    res.status(200).json({ data: updateUserData, message: 'updated' });
  } catch (error) {
    next(error);
  }
};
export const changeUserRole = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const newUserRole = req.body.id;
    const userId = Number(req.params.id);
    if (newUserRole === 1 && req.user.userRole !== 0) {
      throw new Error('Super admin required');
    }
    const success = await UserService.changeUserRole(userId, newUserRole);

    res.status(200).json({ success, message: 'updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    const deleteUserData: User = await UserService.deleteUser(userId);

    res.status(200).json({ data: deleteUserData, message: 'deleted' });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    const password = String(req.body.password);
    const updatedUser: User = await UserService.changePassword(userId, password);

    res.status(200).json({ data: updatedUser, message: 'updated' });
  } catch (error) {
    next(error);
  }
};
