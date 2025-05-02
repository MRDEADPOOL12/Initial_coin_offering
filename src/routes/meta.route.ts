import { Router } from 'express';
import { MetaController } from '@/controllers';

export const path = '/meta';
export const router = Router();

router.get(`${path}/analytics`, MetaController.getMetaForAnalytics);
router.get(`${path}/analytics/user/:id(\\d+)`, MetaController.getMetaForUserAnalyticsByID);

const MetaRouter = {
  path: path,
  router: router,
};
export default MetaRouter;
