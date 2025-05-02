import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import _ from 'lodash';
import { UserModel } from './users.model';
import { Referral } from '@/interfaces/referral.interface';

export type ReferralCreationAttributes = Optional<Referral, 'id'>;

export class ReferralModel extends Model<Referral, ReferralCreationAttributes> implements Referral {
  id?: number;
  code: string;
  userId: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof ReferralModel {
  ReferralModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING(10),
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: UserModel,
          key: 'id',
        },
      },
    },
    {
      tableName: 'referral',
      sequelize,
    },
  );

  return ReferralModel;
}
