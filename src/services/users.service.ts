import { hash } from 'bcryptjs';
import { DB } from '@database';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@/models/users.model';
import { Op } from 'sequelize';

export async function findAllUser(options: { page?: number; pageCount?: number; sortKey?:string; sortOrder?:string; } = { page: 0, pageCount: 25 }) {
  
  const queryOptions: any = {
    order: [[options.sortKey || 'id', options.sortOrder || 'desc']],
  };

  if (options.pageCount !== undefined) {
    queryOptions.limit = options.pageCount;
    queryOptions.offset = options.page * options.pageCount;
  }

  const totalDocs: number = await DB.User.count();
  const allUser = await DB.User.findAll(queryOptions);
  //const allUser = await DB.User.findAll({ limit: options.pageCount, offset: options.page * options.pageCount, order: [[options.sortKey, options.sortOrder]] });
  const totalPages: number = Math.floor(totalDocs / options.pageCount);

  let hasPrevPage = false;
  let hasNextPage = false;
  let prevPage = null;
  let nextPage = null;

  if (totalPages > options.page) {
    hasNextPage = true;
    nextPage = options.page + 1;
  }

  if (options.page > 0) {
    hasPrevPage = true;
    prevPage = options.page - 1;
  }

  await Promise.all(
    allUser.map(async user => {
      const UserInvestmentMeta = await getUserInvestmentData(user.dataValues.id);
      user.dataValues.userInvestmentAmount = UserInvestmentMeta.userInvestmentAmount;
      user.dataValues.userTokensSold = UserInvestmentMeta.userTokensSold;
      return user;
    })
  );

  const returnData = {
    data: allUser,
    totalDocs: totalDocs,
    totalPages: totalPages,
    page: options.page,
    pagingCounter: options.pageCount,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  };
  return returnData;
}

export async function searchUsers(
  searchString: string,
  options: { page?: number; pageCount?: number; order?: [string, string][] } = { page: 0, pageCount: 10 },
): Promise<Omit<User, 'password' | 'emailOtp' | 'phoneOtp'>[]> {
  const allUser = await DB.User.findAll({
    where: { [Op.or]: [{ name: { [Op.like]: `%${searchString}%` } }, { email: { [Op.like]: `%${searchString}%` } }] },
    limit: options.pageCount,
    offset: options.page * options.pageCount,
    order: options.order,
  });
  return allUser;
}
export async function findUserById(userId: number): Promise<User> {
  const findUser = await DB.User.findByPk(userId);
  if (!findUser) throw new HttpException(409, "User doesn't exist");

  return findUser;
}

export async function createUser(userData: CreateUserDto): Promise<User> {
  const findUser: User = await DB.User.findOne({ where: { email: userData.email } });
  if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

   const hashedPassword = await hash(userData.password, 10);
   const createUserData: User = await DB.User.create({ ...userData, password: hashedPassword });
  return createUserData;
}

export async function updateUser(userId: number, userData: CreateUserDto): Promise<User> {
  const findUser: User = await DB.User.findByPk(userId);
  if (!findUser) throw new HttpException(409, "User doesn't exist");

  const hashedPassword = await hash(userData.password, 10);
  await DB.User.update({ ...userData, password: hashedPassword }, { where: { id: userId } });

  const updateUser: User = await DB.User.findByPk(userId);
  return updateUser;
}

export async function changeUserRole(userId: number, userRole: number) {
  await DB.User.update({ userRole: userRole }, { where: { id: userId } });
  return true;
}

export async function deleteUser(userId: number): Promise<User> {
  const findUser: User = await DB.User.findByPk(userId);
  if (!findUser) throw new HttpException(409, "User doesn't exist");

  await DB.User.destroy({ where: { id: userId } });

  return findUser;
}

export async function changePassword(userId: number, newPassword: string): Promise<User> {
  const findUser = await DB.User.findByPk(userId);

  if (!findUser) throw new HttpException(409, "User doesn't exist");
  const hashedPassword = await hash(newPassword, 10);

  const isPasswordMatching: boolean = await findUser.comparePassword(newPassword);

   if (isPasswordMatching) {
    throw new HttpException(403, "New password can't be the current password");
   } else {
    const [updateUser] = await DB.User.update({ password: hashedPassword }, { where: { id: userId } });
    return updateUser[1];
  }
}
export async function getUsersCount() {
  const totalUsers = await DB.User.count();
  if (!totalUsers) throw new HttpException(409, "No Users");
  return totalUsers;
}

export async function getUserInvestmentData(userId: number): Promise<{ userInvestmentAmount: number, userTokensSold: number}> {

  const userInvestmentAmount = await DB.Investment.sum('amount', { 
    where: {
    [Op.and]: [
      { userId: userId },
      { txnStatus: 'approved' }
    ]
    }, 
  });

  const userTokensSold = await DB.Investment.sum('tokenTransfered', { 
    where: {
      [Op.and]: [
        { userId: userId },
        { txnStatus: 'approved' }
      ]
    },
   });

  return {
    userInvestmentAmount: userInvestmentAmount || 0,
    userTokensSold: userTokensSold || 0,
  };
}

export async function getUserRole(email) {
   const findUser = await DB.User.findOne({ where: { email: email } });
   return findUser.dataValues.userRole;
}