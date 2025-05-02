import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import _ from 'lodash';
import { UserModel } from './users.model';
import { Wallet } from '@/interfaces/wallet.interface';

export type WalletCreationAttributes = Optional<Wallet, 'id' | 'walletAddress'>;

export class WalletModel extends Model<Wallet, WalletCreationAttributes> implements Wallet {
  nonce: string;
  id?: number;
  walletAddress: string;
  userId: number;
  verified: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof WalletModel {
  WalletModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nonce: {
        type: DataTypes.STRING(50),
      },
      walletAddress: {
        allowNull: false,
        type: DataTypes.STRING(50),
        unique: true,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: UserModel,
          key: 'id',
        },
      },
      verified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'wallet',
      sequelize,
    },
  );

  return WalletModel;
}
