import { Router } from 'express';
import { InvestmentController } from '@/controllers';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { claimInvestment } from '@/controllers/claimcontroller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { createclaimDto } from '@/dtos/claim.dto';

export const path = '/invest';
export const router = Router();

//router.get(`${path}/wallet/:walletId(\\d+)`, AuthMiddleware, InvestmentController.getAllInvestmentsByWalletId);
router.get(`${path}/all`, AuthMiddleware, InvestmentController.getAllInvestments);
router.get(`${path}/not-minted`, AuthMiddleware, InvestmentController.getAllInvestmentsByMinted);
router.patch(`${path}/transaction-hash/batch`, AuthMiddleware, InvestmentController.batchUpdateTransactionHash);
router.patch(`${path}/transaction-hash/batch2`, AuthMiddleware, InvestmentController.batchUpdateTransactionHashv2);

router.post(`${path}/manual`, AuthMiddleware, InvestmentController.createInvestment);
router.post(`${path}`, AuthMiddleware, InvestmentController.createInvestment);
router.get(`${path}/:userId(\\d+)`, AuthMiddleware, InvestmentController.getAllInvestmentsByUserId);
router.get(`${path}/`, AuthMiddleware, InvestmentController.getAllInvestments);
router.put(`${path}/:id(\\d+)`, AuthMiddleware, InvestmentController.updateInvestment);
router.delete(`${path}/:id(\\d+)`, AuthMiddleware, InvestmentController.deleteInvestment);
router.post('/claim', claimInvestment);

const InvestmentRouter = {
  path: path,
  router: router,
};
export default InvestmentRouter;
