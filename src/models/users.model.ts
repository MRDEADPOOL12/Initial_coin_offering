import { Sequelize, DataTypes, Model, Optional, EnumDataType } from 'sequelize';
import { User } from '@interfaces/users.interface';
import { compare } from 'bcryptjs';
import _ from 'lodash';
import { log } from 'console';

export type UserCreationAttributes = Optional<User, 'id' | 'email' | 'password'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  id?: number;
  email: string;
  password?: string;
  emailOtp?: string;
  phoneOtp?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  invested: boolean;
  wpViewed: boolean;
  wpDownloaded: boolean;
  userRole: number;
  phone?: string;
  name: string;
  referrerId?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public comparePassword = async (inputPass: string) => {
    await this.reload({
      attributes: {
        include: ['password'],
      },
    });
    return await compare(inputPass, this.dataValues.password);
  }
  public  compareEmailOtp = (otpInput: string) =>{
    // await this.reload({
    //   attributes: {
    //     include: ['emailOtp'],
    //   },
    // });
    console.log(otpInput,this.dataValues.emailOtp)
    console.log(otpInput,this)

    return otpInput === this.dataValues.emailOtp;
  }
  public  comparePhoneOtp= (otpInput: string) => {
    // await this.reload({
    //   attributes: {
    //     include: ['phoneOtp'],
    //   },
    // });
    return otpInput === this.dataValues.phoneOtp;
  }
  public getPublicData() {
    return _.omit(this.get(), ['password', 'emailOtp', 'phoneOtp']);
  }
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      referrerId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: UserModel,
          key: 'id',
        },
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      emailOtp: {
        allowNull: true,
        type: DataTypes.STRING(10),
      },
      phoneOtp: {
        allowNull: true,
        type: DataTypes.STRING(10),
      },
      isEmailVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN(),
        defaultValue: false,
      },
      isPhoneVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN(),
        defaultValue: false,
      },
      phone: {
        allowNull: true,
        type: DataTypes.STRING(15),
      },
      userRole: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },
      wpViewed: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      wpDownloaded: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      invested: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // userInvestmentAmount: {
      //   allowNull: true,
      //   type: DataTypes.NUMBER,
      //   defaultValue: false,
      // },
      // userTokensSold: {
      //   allowNull: true,
      //   type: DataTypes.NUMBER,
      //   defaultValue: false,
      // },
    },
    {
      tableName: 'user',
      sequelize,
      defaultScope: {
        attributes: {
          exclude: ['password', 'emailOtp', 'phoneOtp'],
        },
      },
    },
  );

  return UserModel;
}
