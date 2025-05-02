import { HttpException } from "@/exceptions/httpException";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { NextFunction, Response } from "express";
import { UserService } from '@/services';
export const VipAuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userRole = await UserService.getUserRole(req.body.email);
    if (userRole) {
      if (userRole === 3 || userRole === 1) {
        next();
      } else {
        next(new HttpException(403, 'VIP required'));
      }
    } else {
      next(new HttpException(403, 'Unauthorized'));
    }
  } catch (error) {
    next(new HttpException(403, 'user not found'));
  }
};