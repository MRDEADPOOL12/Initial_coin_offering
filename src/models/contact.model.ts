import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Contact } from '@interfaces/contact.interface';

// export type UserCreationAttributes = Optional<User, 'id' | 'email' | 'password'>;

export class ContactModel extends Model<Contact> implements Contact {
  public id: number;
  public name: string;
  public email: string;
  public phone: string;
  public subject: string;
  public message: string;
  public reply: string;
}

export default function (sequelize: Sequelize): typeof ContactModel {
  ContactModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING(15),
      },
      subject: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      message: {
        allowNull: false,
        type: DataTypes.TEXT(),
      },
      reply: {
        allowNull: true,
        type: DataTypes.TEXT(),
      },
    },
    {
      tableName: 'contact',
      sequelize,
    },
  );

  return ContactModel;
}
