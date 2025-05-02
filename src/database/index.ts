import Sequelize from 'sequelize';
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '@config';
import UserModel from '@models/users.model';
import ContactModel from '@/models/contact.model';
import { logger } from '@utils/logger';
import ReferralModel from '@/models/referral.model';
import WalletModel from '@/models/wallet.model';
import InvestmentModel from '@/models/investment.model';
import MetaModel from '@/models/meta.model';

const sequelize = new Sequelize.Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  dialect: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  timezone: '+05:30',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: NODE_ENV === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

try {
  sequelize.authenticate().then(() => {
    logger.debug('DB connection established');
  });
} catch (e) {
  logger.log(e);
}

export const DB = {
  User: UserModel(sequelize),
  Contact: ContactModel(sequelize),
  Referral: ReferralModel(sequelize),
  Wallet: WalletModel(sequelize),
  Investment: InvestmentModel(sequelize),
  Meta: MetaModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};
