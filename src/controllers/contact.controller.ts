import { NextFunction, Request, Response } from 'express';
import { Contact } from '@interfaces/contact.interface';
import { ContactService } from '@/services';
import { CreateContactDto } from '@/dtos/contact.dto';

export const getAllInquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const findAllInquiriesData: Contact[] = await ContactService.findAllInquiries();

    res.status(200).json({ data: findAllInquiriesData, message: 'findAll' });
  } catch (error) {
    next(error);
  }
};

export const createInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiryData: CreateContactDto = req.body;
    const createInquiryData: Contact = await ContactService.createInquiry(inquiryData);

    res.status(201).json({ data: createInquiryData, message: 'created' });
  } catch (error) {
    next(error);
  }
};

export const sendReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiryId = Number(req.params.id);
    const inquiryReply = req.body.reply;
    const updateReplyData: Boolean = await ContactService.sendReply(inquiryId, inquiryReply);

    res.status(201).json({ data: updateReplyData, message: 'sent reply' });
  } catch (error) {
    next(error);
  }
};

export const getReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiryId = Number(req.params.id);
    const findInquiryReply = await ContactService.findReply(inquiryId);

    res.status(200).json({ data: findInquiryReply, message: 'findReply' });
  } catch (error) {
    next(error);
  }
};
