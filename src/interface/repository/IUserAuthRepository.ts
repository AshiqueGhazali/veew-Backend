import { IOtp, IOtpCreationAttributes } from "../../entity/otpEntity";
import { Model } from "sequelize";
import { registerBody } from "../useCase/IUserAuthUseCase";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import { googleAuthBody } from "../controler/IUserAuthController";
import { INotification, INotificationCreationAttributes } from "../../entity/notificationsEntity";

export default interface IUserAuthRepository {
  savedOtp(email: string, otp: number): Promise<void>;
  verifyOtp(email: string): Promise<Model<IOtp, IOtpCreationAttributes> | null>;
  createUser(data: registerBody): Promise<Model<IUser, IUserCreationAttributes> | null>;
  findUser(
    email: string
  ): Promise<Model<IUser, IUserCreationAttributes> | null>;
  isBlock(userId: string): Promise<boolean>;
  updatePassword(password: string, email: string): Promise<void>;
  saveGooogleAuth(data:googleAuthBody):Promise<Model<IUser|IUserCreationAttributes>>
  createNotification(userId:string,notificationHead:string,notification:string):Promise<Model<INotification,INotificationCreationAttributes>>

}
