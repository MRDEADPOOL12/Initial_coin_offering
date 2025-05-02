import { NextFunction, Request, Response } from 'express';
import { Investment } from './../interfaces/investment.interface';
import { InvestmentService, WalletService } from '@/services';
import { Wallet } from '@/interfaces/wallet.interface';
import { WalletModel } from '@/models/wallet.model';
import { RequestWithUser } from '@/interfaces/auth.interface';

export const createInvestment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const investmentData: Investment = req.body;
    const walletAddress: string = investmentData.walletAddress; // Extract the wallet address from the investment data
    // Find the wallet based on the wallet address
    const wallet: Wallet | null = await WalletModel.findOne({ where: { walletAddress } });

    if (!wallet) {
      // Create the wallet if it is not found
      const walletData = await WalletService.createWallet(req.user.id, walletAddress);
    }
    // Create the investment using the wallet address and user ID
    const createInvestmentData: Investment = await InvestmentService.createInvestment({
      ...investmentData,
      walletAddress, // Use the wallet address instead of the wallet ID
      userId: req.user.id,
    });

    res.status(201).json({ data: createInvestmentData, message: 'created' });
  } catch (error) {
    next(error);
  }
};

export const updateInvestment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const investmentId = Number(req.params.id);
    const investmentData: Investment = req.body;
    const updateInvestmentData: Boolean = await InvestmentService.updateInvestment(investmentId, investmentData);

    res.status(200).json({ data: updateInvestmentData, message: 'updated' });
  } catch (error) {
    next(error);
  }
};

export const getAllInvestments = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const findAllInvestments: Investment[] = await InvestmentService.findAllInvestments({
      page: parseInt(req.query.page ? req.query.page.toString() : '0'),
      pageCount : req.query.pageCount ? parseInt(req.query.pageCount.toString()) : undefined,
      sortKey : req.query.sortKey || 'id',
      sortOrder : req.query.sortOrder || 'desc'
    });

    res.status(200).json({ data: findAllInvestments, message: 'findAll' });
  } catch (error) {
    next(error);
  }
};

export const getAllInvestmentsByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const findAllInvestmentsData: Investment[] = await InvestmentService.findAllInvestmentsByUserId({
      userId: Number(req.params.userId),
      page: parseInt(req.query.page ? req.query.page.toString() : '0'),
      pageCount : req.query.pageCount ? parseInt(req.query.pageCount.toString()) : undefined,
      sortKey : req.query.sortKey || 'id',
      sortOrder : req.query.sortOrder || 'desc'
    });

    //const findAllInvestmentsData: Investment[] = await InvestmentService.findAllInvestmentsByUserId(userId);
    res.status(200).json({ data: findAllInvestmentsData, message: 'findAll' });
  } catch (error) {
    next(error);
  }
};

export const getAllInvestmentsByWalletId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const findAllInvestmentsData: Investment[] = await InvestmentService.findAllInvestmentByWalletId({
      walletId: Number(req.params.walletId),
      page: parseInt(req.query.page ? req.query.page.toString() : '0'),
      pageCount: parseInt(req.query.pageCount ? req.query.pageCount.toString() : '10'),
      sortKey: req.query.sortKey,
      sortOrder: req.query.sortOrder
    });
    //const findAllInvestmentsData: Investment[] = await InvestmentService.findAllInvestmentByWalletId(req.params.walletId);

    res.status(200).json({ data: findAllInvestmentsData, message: 'findAll' });
  } catch (error) {
    next(error);
  }
};

export const getAllInvestmentsByMinted = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const findAllInvestments: Investment[] = await InvestmentService.findAllInvestmentByMinted({
      page: parseInt(req.query.page ? req.query.page.toString() : '0'),
      pageCount : req.query.pageCount ? parseInt(req.query.pageCount.toString()) : undefined,
      sortKey : req.query.sortKey || 'id',
      sortOrder : req.query.sortOrder || 'desc'
    });
    res.status(200).json({ data: findAllInvestments, message: 'findAll' });
  } catch (error) {
    next(error);
  }
};

export const deleteInvestment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const investmentId = Number(req.params.id);
    const deleteInvestmentData: Investment = await InvestmentService.deleteInvestment(investmentId);

    res.status(200).json({ data: deleteInvestmentData, message: 'deleted' });
  } catch (error) {
    next(error);
  }
};

export const batchUpdateTransactionHash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { txnHash, value } = req.body as TransactionHash;
    const updateInvestmentData: Boolean = await InvestmentService.batchUpdateTransactionHash(txnHash, value);

    res.status(200).json({ data: updateInvestmentData, message: 'updated' });
  } catch (error) {
    next(error);
  }
};

export const batchUpdateTransactionHashv2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.body as Record<string, Partial<Investment>>;
    const updateInvestmentData: Boolean = await InvestmentService.batchUpdateTransactionHashv2(params);

    res.status(200).json({ data: updateInvestmentData, message: 'updated' });
  } catch (error) {
    next(error);
  }
};

export interface TransactionHash {
  txnHash: string[];
  value: Partial<Investment>;
}
