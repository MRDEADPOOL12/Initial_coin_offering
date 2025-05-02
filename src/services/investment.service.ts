import { InvestmentModel } from '../models/investment.model';
import { Investment } from '../interfaces/investment.interface';
import { compare } from 'bcryptjs';
import { DB } from '@database';
import { HttpException } from '@/exceptions/httpException';
import { Op } from 'sequelize';
import { TransactionHash } from '@/controllers/investment.controller';
import { UserModel } from '../models/users.model';

export async function createInvestment(investmentData: Investment): Promise<Investment> {
  const createInvestmentData: Investment = await DB.Investment.create(investmentData);
  return createInvestmentData;
}

export async function updateInvestment(investmentId: number, investmentData: Investment): Promise<boolean> {
  const findInvestment: Investment = await DB.Investment.findByPk(investmentId);
  if (!findInvestment) throw new HttpException(409, "Investment doesn't exist");

  await DB.Investment.update({ ...investmentData }, { where: { id: investmentId } });
  return true;
}

export async function deleteInvestment(investmentId: number): Promise<Investment> {
  const findInvestment: Investment = await DB.Investment.findByPk(investmentId);
  if (!findInvestment) throw new HttpException(409, "Investment doesn't exist");

  await DB.Investment.destroy({ where: { id: investmentId } });
  return findInvestment;
}

export async function batchUpdateTransactionHash(transactionHashs: string[], params: Partial<Investment>): Promise<boolean> {
  const { tokenTransfered, isTokenMinted, txnStatus } = params
  await DB.Investment.update({ tokenTransfered, isTokenMinted, txnStatus }, { where: { txnHash: transactionHashs } });
  return true;
}

export async function batchUpdateTransactionHashv2(params: Record<string, Partial<Investment>>): Promise<boolean> {
  const transactions = Object.entries(params).map(([txnHash, {tokenTransfered, isTokenMinted, txnStatus}])=> DB.Investment.update({ tokenTransfered, isTokenMinted, txnStatus }, { where: { txnHash } }))
  await Promise.all(transactions)
  return true;
}

export async function findAllInvestments(options: { page?: number; pageCount?: number; sortKey?:string; sortOrder?:string; } = { page: 0, pageCount: 25 }) {

  const queryOptions: any = {
    order: [[options.sortKey || 'id', options.sortOrder || 'desc']],
    include: [
      {
        model: UserModel,
        as: 'user',
        attributes: ['email'],
      },
    ],
  };

  if (options.pageCount !== undefined) {
    queryOptions.limit = options.pageCount;
    queryOptions.offset = options.page * options.pageCount;
  }

  const allInvestments = await DB.Investment.findAll(queryOptions);

  const totalDocs: number = await DB.Investment.count();
  const totalPages: number = Math.floor(totalDocs / options.pageCount);
  const finaldata = investmentPagination(allInvestments, totalDocs, totalPages, options.page, options.pageCount);
  return finaldata;
}

export async function findAllInvestmentsByUserId(options: { userId: number, page?: number; pageCount?: number; sortKey?:string; sortOrder?:string; } = {page: 0, pageCount: 25,userId: 0}) {
  
  const queryOptions: any = {
    where: { userId: options.userId },
    order: [[options.sortKey || 'id', options.sortOrder || 'desc']]
  };

  if (options.pageCount !== undefined) {
    queryOptions.limit = options.pageCount;
    queryOptions.offset = options.page * options.pageCount;
  }

  const allInvestments = await DB.Investment.findAll(queryOptions);

  //const allInvestments: Investment[] = await DB.Investment.findAll({ where: { userId: options.userId }, limit: options.pageCount, offset: options.page * options.pageCount, order: [[options.sortKey, options.sortOrder]] });
  const totalDocs: number = await DB.Investment.count({ where: { userId: options.userId } });
  const totalPages: number = Math.floor(totalDocs / options.pageCount);
  const finaldata = investmentPagination(allInvestments, totalDocs, totalPages, options.page, options.pageCount);
  return finaldata;
}

export async function findAllInvestmentByWalletId(options: { walletId: number, page?: number; pageCount?: number; sortKey?:string; sortOrder?:string; } = { page: 0, pageCount: 10, walletId:0 }) {
  const allInvestments: Investment[] = await DB.Investment.findAll({ where: { walletId: options.walletId }, limit: options.pageCount, offset: options.page * options.pageCount, order: [[options.sortKey, options.sortOrder]] });

  const totalDocs: number = await DB.Investment.count({where: { walletId: options.walletId }});
  const totalPages: number = Math.floor(totalDocs / options.pageCount);
  const finaldata = investmentPagination(allInvestments, totalDocs, totalPages, options.page, options.pageCount);
  return finaldata;
}

export async function findAllInvestmentByMinted(options: { page?: number; pageCount?: number; sortKey?:string; sortOrder?:string;} = { page: 0, pageCount: 25 }) {

  const queryOptions: any = {
    where: { isTokenMinted: false },
    order: [[options.sortKey || 'id', options.sortOrder || 'desc']]
  };

  if (options.pageCount !== undefined) {
    queryOptions.limit = options.pageCount;
    queryOptions.offset = options.page * options.pageCount;
  }

  const allInvestments = await DB.Investment.findAll(queryOptions);

  //const allInvestments: Investment[] = await DB.Investment.findAll({ where: { isTokenMinted: false }, limit: options.pageCount, offset: options.page * options.pageCount, order: [[options.sortKey, options.sortOrder]] });
  const totalDocs: number = await DB.Investment.count({ where: { isTokenMinted: false } });
  const totalPages: number = Math.floor(totalDocs / options.pageCount);
  const finaldata = investmentPagination(allInvestments, totalDocs, totalPages, options.page, options.pageCount);
  return finaldata;
}

export async function getInvestmentMeta(): Promise<{ investmentAmount: number; tokensSold: number }> {
  const investmentAmount = await DB.Investment.sum('amount', { where: { txnStatus: 'approved' } });
  const tokensSold = await DB.Investment.sum('tokenTransfered', { where: { txnStatus: 'approved' } });

  return {
    investmentAmount: investmentAmount || 0,
    tokensSold: tokensSold || 0,
  };
}

export async function investmentPagination(allInvestments, totalDocs, totalPages, optionpage, optionpageCount){
  let hasPrevPage = false;
  let hasNextPage = false;
  let prevPage = null;
  let nextPage = null;

  if (totalPages > optionpage) {
    hasNextPage = true;
    nextPage = optionpage + 1;
  }

  if (optionpage > 0) {
    hasPrevPage = true;
    prevPage = optionpage - 1;
  }
  const returnData = {
    data: allInvestments,
    totalDocs: totalDocs,
    totalPages: totalPages,
    page: optionpage,
    pagingCounter: optionpageCount,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  };
  
  return returnData;
}
