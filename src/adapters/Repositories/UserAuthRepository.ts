import IUserAuthRepository from "../../interface/repository/IUserAuthRepository";
import User from "../../framework/models/UserModel";
import { IOtp, IOtpCreationAttributes } from "../../entity/otpEntity";
import { ModelDefined } from "sequelize";
import { Model } from "sequelize";
import { registerBody } from "../../interface/useCase/IUserAuthUseCase";
import { IUserCreationAttributes, IUser } from "../../entity/userEntity";

class UserAuthRepository implements IUserAuthRepository {
  private OtpModel: ModelDefined<IOtp, IOtpCreationAttributes>;

  constructor(OtpModel: ModelDefined<IOtp, IOtpCreationAttributes>) {
    this.OtpModel = OtpModel;
  }

  async savedOtp(email: string, otp: number): Promise<void> {
    const expiresAt = new Date(new Date().getTime() + 3 * 60000);

    const newOtp = await this.OtpModel.create({
      email: email,
      otp: otp,
      expiresAt: new Date(),
    });
  }

  async findUser(
    email: string
  ): Promise<Model<IUser, IUserCreationAttributes> | null> {
    const userData = await User.findOne({
      where: {
        email: email,
      },
    });

    return userData;
  }

  async verifyOtp(
    email: string
  ): Promise<Model<IOtp, IOtpCreationAttributes> | null> {
    const otpdata = await this.OtpModel.findOne({
      where: {
        email: email,
      },
    });

    console.log("you datas are :", otpdata);

    return otpdata;
  }

  async createUser(data: registerBody): Promise<void> {
    const { firstName, lastName, email, password } = data;
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
  }

  async isBlock(userId: string): Promise<boolean> {
    try {
      const user = await User.findOne({ where: { id: userId } });

      if (user?.dataValues.isBlock) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(password: string, email: string): Promise<void> {
    try {
      await User.update(
        { password: password },
        {
          where: {
            email: email,
          },
        }
      );

      return;
    } catch (error) {
      throw error;
    }
  }
}

export default UserAuthRepository;
