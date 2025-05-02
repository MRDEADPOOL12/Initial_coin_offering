import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { WalletController } from '@/controllers';

export const path = '/wallet-connect';
export const router = Router();

router.get(`${path}/:walletAddress/login`, WalletController.getNonce);
router.post(`${path}/login/verify`, WalletController.verifyNonce);
router.get(`${path}/:walletAddress/register`, AuthMiddleware, WalletController.getNonceByWalletId);
router.post(`${path}/register/verify`, AuthMiddleware, WalletController.verifyNonceAndUpdateWallet);

const WalletRouter = {
  path: path,
  router: router,
};
export default WalletRouter;
