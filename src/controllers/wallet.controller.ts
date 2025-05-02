import { RequestWithUser } from '@/interfaces/auth.interface';
import { WalletService } from '@/services';
import { NextFunction, Response } from 'express';
import { generateNonce } from 'siwe';
import { recoverMessageAddress } from 'viem';

export const getNonce = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { walletAddress } = req.params;
    const wallet = await WalletService.findWalletById(walletAddress);

    if (!wallet) return res.status(422).json({ message: 'Wallet not found.' });

    const nonce = generateNonce();
    await WalletService.updateWallet(walletAddress, { nonce });
    res.json({
      success: true,
      data: {
        nonce,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyNonce = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, signature } = req.body;
    const wallet = await WalletService.findWalletById(walletAddress);

    if (!wallet) return res.status(422).json({ message: 'Wallet not found.' });

    const message = {
      address: walletAddress,
      statement: 'Sign in with Ethereum to the Trapaaca.',
      uri: req.headers.origin,
      version: '1',
      nonce: wallet.nonce,
    };
    const address = await recoverMessageAddress({
      message: JSON.stringify(message),
      signature,
    });

    if (address !== walletAddress) return res.status(422).json({ message: 'Invalid signature.' });

    const { accessToken, refreshToken } = await WalletService.generateTokens(wallet.userId);
    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get nonce for register new wallet
export const getNonceByWalletId = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const walletAddress = req.params.walletAddress as string;
    const wallet = await WalletService.findWalletById(walletAddress);
    const nonce = generateNonce();
    if (!wallet) {
      const walletData = await WalletService.createWallet(req.user.id, walletAddress, nonce);
      console.log('walletData', walletData);
      return res.json({
        success: !!walletData,
        data: {
          nonce,
        },
      });
    } else if (wallet.verified) return res.status(422).json({ message: 'Wallet already verified.' });

    const walletData = await WalletService.updateWallet(walletAddress, { nonce });
    console.log('walletData', walletData);
    res.json({
      success: !!walletData,
      data: {
        nonce,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyNonceAndUpdateWallet = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, signature } = req.body;
    const wallet = await WalletService.findWalletById(walletAddress);

    if (!wallet) return res.status(422).json({ message: 'Wallet not found.' });

    const parsedWallet = JSON.parse(JSON.stringify(wallet));
    const nonce = parsedWallet.nonce;

    const message = {
      address: walletAddress,
      statement: 'Sign in with Ethereum to the Trapaaca.',
      uri: req.headers.origin,
      version: '1',
      nonce,
    };

    const address = await recoverMessageAddress({
      message: JSON.stringify(message),
      signature,
    });

    if (address !== walletAddress) return res.status(422).json({ message: 'Invalid signature.' });

    await WalletService.updateWallet(walletAddress, { verified: true });
    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
