import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Meta } from '@interfaces/meta.interface';

// export type UserCreationAttributes = Optional<User, 'id' | 'email' | 'password'>;

export class MetaModel extends Model<Meta> implements Meta {
  public id: number;
  public meta_name: string;
  public meta_value: string;
}

export default function (sequelize: Sequelize): typeof MetaModel {
    MetaModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      meta_name: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      meta_value: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
    },
    {
      tableName: 'meta',
      sequelize,
    },
  );

  return MetaModel;
}
