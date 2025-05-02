import { DB } from '@/database';
import { Wallet } from '@/interfaces/wallet.interface';
import { createAccessToken, createRefreshToken } from './auth.service';

export const createWallet = async (userId: number, walletAddress: string, nonce?: string) => {
  await DB.Wallet.create({ userId, walletAddress, nonce: nonce });
  return true;
};

export async function findWalletById(walletAddress: string): Promise<Wallet> {
  const wallet = await DB.Wallet.findOne({ where: { walletAddress } });
  if (!wallet) return null;
  return wallet.dataValues;
}

export const updateWallet = async (walletAddress: string, walletData: { nonce?: string; verified?: boolean }) =>
  await DB.Wallet.update({ ...walletData }, { where: { walletAddress } });

export const generateTokens = async (userId: number) => {
  const user = await DB.User.findByPk(userId);
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  return { accessToken, refreshToken };
};
