import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Investment } from './../interfaces/investment.interface';
import { WalletModel } from './wallet.model';
import { UserModel } from './users.model';

type InvestmentCreationAttributes = Optional<Investment, 'id'>;

export class InvestmentModel extends Model<Investment, InvestmentCreationAttributes> implements Investment {
  walletAddress: string;
  public id: number;
  public userId: number;
  public txnHash: string;
  public amount: number;
  public currency: string;
  public tokenTransfered: boolean;
  public txnStatus: string;
  public isTokenMinted: boolean;
  public mintTxnHash: string;
  public transferWalletAddr: string;
  public referralCode: string;
  public txn_chain: string;

  public createdAt: string;
  public updatedAt: string;

  public readonly user?: UserModel;
}

export default function (sequelize: Sequelize): typeof InvestmentModel {
  InvestmentModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: UserModel,
          key: 'id',
        },
      },
      walletAddress: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      txnHash: {
        allowNull: false,
        type: DataTypes.STRING(255),
        unique: true,
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      currency: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      tokenTransfered: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
      txnStatus: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      isTokenMinted: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      mintTxnHash: {
        allowNull: true,
        type: DataTypes.STRING(50),
      },
      transferWalletAddr: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      referralCode: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      txn_chain: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
    },
    {
      tableName: 'investment',
      sequelize,
    },
  );

  InvestmentModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user',
  });

  return InvestmentModel;
}
