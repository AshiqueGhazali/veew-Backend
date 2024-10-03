import { IOtp, IOtpCreationAttributes} from "../../entity/otpEntity";
import { Model, ModelDefined } from "sequelize";


export default interface IUserAuthRepository {
    savedOtp(email: string, otp: number): Promise<void>;
    verifyOtp(email:string):Promise<Model<IOtp, IOtpCreationAttributes>|null>
  }
  