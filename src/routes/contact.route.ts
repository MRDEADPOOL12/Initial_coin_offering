import { Router } from 'express';
import { CreateContactDto } from '@dtos/contact.dto';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AdminAuthMiddleware, AuthMiddleware } from '@/middlewares/auth.middleware';
import { ContactController } from '@/controllers';

export const path = '/contactus';
export const router = Router();

//router.get('/contactus', AdminAuthMiddleware, ContactController.getAllInquiries);
//router.post('/contactus', ValidationMiddleware(CreateContactDto), ContactController.createInquiry);
//router.put('/contactus/:id(\\d+)', AdminAuthMiddleware, ValidationMiddleware(CreateContactDto, true), ContactController.sendReply);
//router.get('/contactus/:id(\\d+)', AdminAuthMiddleware, ContactController.getReply);

const ContactRouter = {
  path: path,
  router: router,
};
export default ContactRouter;
