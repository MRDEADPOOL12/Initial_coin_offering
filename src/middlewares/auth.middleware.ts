import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DB } from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { createAccessToken, createCookie } from '@/services/auth.service';
import { UserService } from '@/services';

const getAuthorization = req => {
  const cookie = req.cookies['access_token'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};
const getRefreshToken = req => {
  const header = req.header['refresh_token'];
  if (header) return header;
};

export const AdminAuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userRole  = await UserService.getUserRole(req.body.email);
    if (userRole) {
      if (req.user.userRole <= 1) {
        next();
      } else {
        next(new HttpException(401, 'Admin required'));
      }
    } else {
    next(new HttpException(401, 'Unauthorized'));
  }
}
export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);
    const refreshToken = getRefreshToken(req);
    console.log(Authorization)
    if (Authorization) {
  
      const params = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const { id } = params

      const findUser = await DB.User.findByPk(id);

      if (findUser) {
        req.user = findUser.dataValues;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else if (refreshToken) {
      const { id } = verify(refreshToken, SECRET_KEY) as DataStoredInToken;
      const findUser = await DB.User.findByPk(id);
      const accessToken = createAccessToken(findUser);
      const accessTokencookie = createCookie('access_token', accessToken);
      res.setHeader('Set-Cookie', [accessTokencookie]);
      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
