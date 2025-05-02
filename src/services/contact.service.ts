import { compare } from 'bcryptjs';
import { DB } from '@database';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { Contact } from '@interfaces/contact.interface';
import { CreateContactDto } from '@/dtos/contact.dto';
import NodeMailer from 'nodemailer';
import { hash } from 'bcryptjs';

export async function findAllInquiries(): Promise<Contact[]> {
  const allInquiries: Contact[] = await DB.Contact.findAll();
  return allInquiries;
}

export async function createInquiry(inquiryData: CreateContactDto): Promise<Contact> {
  //   const findUser: Contact = await DB.Contact.findOne({ where: { email: userData.email } });
  //   if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

  //const hashedPassword = await hash(userData.password, 10);
  const createInquiryData: Contact = await DB.Contact.create({ ...inquiryData });
  return createInquiryData;
}

export async function sendReply(inquiryId: number, inquiryReply: string): Promise<Boolean> {
  const inquiry: Contact = await DB.Contact.findByPk(inquiryId);

  if (!inquiry) throw new HttpException(409, "Message doesn't exist");

  const transporter = NodeMailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'noreply@lotshouse.com',
      pass: 'ixyjpzseshzzzszm',
    },
  });
  await transporter.sendMail({
    from: 'from@gmail.com',
    to: inquiry.email,
    subject: 'Reply to Your Inquiry',
    html: `Hi ${inquiry.name}, <br><br>
    This is regarding your inquiry ${inquiry.subject}<br>
    ${inquiryReply}`,
  });

  await DB.Contact.update({ reply: inquiryReply }, { where: { id: inquiryId } });
  return true;
}

export async function findReply(inquiryId: number): Promise<String> {
  const inquiryReply = (await DB.Contact.findOne({ where: { id: inquiryId } })).reply;
  return inquiryReply;
}
