import { InvestmentModel } from '../models/investment.model';

export const createInvestment = async (investmentData) => {
  try {
    const investment = await InvestmentModel.create(investmentData);
    return investment;
  } catch (error) {
    throw new Error('Error creating investment');
  }
};
