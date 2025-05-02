import initializeApp, { listenApp } from '@/app';
import AuthRouter from '@routes/auth.route';
import UserRouter from '@routes/users.route';
import ContactRouter from './routes/contact.route';
import { ValidateEnv } from '@utils/validateEnv';
import { NODE_ENV, PORT } from './config';
import express from 'express';
import InvestmentRouter from './routes/investment.route';
import WalletRouter from './routes/wallet.route';
import serverless from 'serverless-http';
import MetaRouter from './routes/meta.route';

ValidateEnv();
const env = NODE_ENV || 'development';
const port = PORT || 3000;
const app = express();

try {
  initializeApp(app, [AuthRouter, UserRouter, ContactRouter, InvestmentRouter, WalletRouter, MetaRouter]);
  if(env == "local") listenApp(app, port, env);
} catch (e) {
  console.log(e);
}

export const handler = serverless(app);
