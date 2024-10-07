import { IOtp, IOtpCreationAttributes} from "../../entity/otpEntity";
import { Model } from "sequelize";
import { registerBody } from "../useCase/IUserAuthUseCase";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";


export default interface IUserAuthRepository {
    savedOtp(email: string, otp: number): Promise<void>;
    verifyOtp(email:string):Promise<Model<IOtp, IOtpCreationAttributes>|null>;
    createUser(data:registerBody):Promise<void>
    findUser(email:string):Promise<Model<IUser, IUserCreationAttributes>| null>
  }
  