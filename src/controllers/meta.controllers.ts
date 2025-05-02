import { NextFunction, Request, Response } from 'express';
import { MetaService } from '@/services';
import { InvestmentService } from '@/services';
import { UserService } from '@/services';

 
export const getMetaForAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allMetaData = await MetaService.findMetaData();
    const investmentMeta  = await InvestmentService.getInvestmentMeta();
    const totalUsersCount  = await UserService.getUsersCount();
    
    const totalTokens = Number(allMetaData['totalToken']);
    const totalTokensAmount = Number(allMetaData['totalTokenAmount']);
    const hardCap = Number(allMetaData['hardCap']);
    const softCap = Number(allMetaData['softCap']);
    const icoTimeout = allMetaData['icoTimeout'];
    const tokenSold = Number(investmentMeta['tokensSold']);
    const TotalInvestedAmount = Number(investmentMeta['investmentAmount']);
    const tokenRemaining = totalTokens - tokenSold;

    const metaValues = {
      'totalTokens': totalTokens,
      'totalTokensAmount': totalTokensAmount,
      'hardCap': hardCap,
      'softCap': softCap,
      'icoTimeout': icoTimeout,
      'tokenSold': tokenSold,
      'tokenRemaining': tokenRemaining,
      'TotalInvestedAmount': TotalInvestedAmount,
      'totalUsers': totalUsersCount
    }
    res.status(200).json({ data: metaValues, message: 'metaData' });
  } catch (error) {
    next(error);
  }
};

export const getMetaForUserAnalyticsByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    const UserInvestmentMeta  = await UserService.getUserInvestmentData(userId);
    
    const userInvestmentAmount = Number(UserInvestmentMeta['userInvestmentAmount']);
    const userTokensSold = Number(UserInvestmentMeta['userTokensSold']);

    const metaValues = {
      'totalInvestment': userInvestmentAmount,
      'totalTokensPurchased': userTokensSold
    }
    res.status(200).json({ data: metaValues, message: 'metaData' });
  } catch (error) {
    next(error);
  }
};
