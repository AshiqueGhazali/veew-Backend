import IUserAuthRepository from '../interface/repository/IUserAuthRepository';
import { emailBody } from '../interface/controler/IUserAuthController';
import { IOtpService } from '../interface/utils/IOtpService';
import IUserAuthUseCase, { resObj } from '../interface/useCase/IUserAuthUseCase';

class UserAuthUseCase implements IUserAuthUseCase {
  private userAuthRepository: IUserAuthRepository
  private otpService:IOtpService

  constructor(userAuthRepository: IUserAuthRepository,otpService:IOtpService) {
    this.userAuthRepository = userAuthRepository
    this.otpService= otpService
  }

  async sendOtp(email: emailBody['email']): Promise<void> {    
    
    const otp:number = await this.otpService.generateOtp()
    await this.otpService.sendOtp(email,otp)
    
  }

  async verifyOtp(email: string, otp: number): Promise<resObj | null> {


    console.log("heeeeyyy mahhhnnnnnn");
    
    const otpData = await this.userAuthRepository.verifyOtp(email)

    console.log("otp data is :",otpData?.dataValues);
    

    if(otpData){
      if(otpData.dataValues.otp=== otp){
        return  {
          status:true,
          message:"otp verified successfully"
        }
      }
    }
    return  {
      status:false,
      message:"Otp verification Failed"
    }
  }



  

}

export default UserAuthUseCase;
