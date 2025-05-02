import { HttpException } from "@/exceptions/httpException";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { NextFunction, Response } from "express";
import { UserService } from '@/services';
export const MintorAuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userRole = await UserService.getUserRole(req.body.email);
    if (userRole) {
      if (userRole === 2 || userRole === 1) {
        next();
      } else {
        next(new HttpException(401, 'Mentor or Admin required'));
      }
    } else {
      next(new HttpException(401, 'Unauthorized'));
    }
  } catch (error) {
    next(new HttpException(500, 'user not found'));
  }
};