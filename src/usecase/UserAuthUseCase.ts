import IUserAuthRepository from '../interface/repository/IUserAuthRepository';
import { emailBody } from '../interface/controler/IUserAuthController';
import { IOtpService } from '../interface/utils/IOtpService';
import IUserAuthUseCase, { loginBody, registerBody, resObj,VerifyTokenResponse } from '../interface/useCase/IUserAuthUseCase';
import IhasingService from '../interface/utils/IHashingService';
import IJwtService from "../interface/utils/IJwtService";


class UserAuthUseCase implements IUserAuthUseCase {
  private userAuthRepository: IUserAuthRepository
  private otpService:IOtpService
  private hashingService:IhasingService
  private jwtServices: IJwtService;


  constructor(userAuthRepository: IUserAuthRepository,otpService:IOtpService,hashingService:IhasingService,jwtServices:IJwtService) {
    this.userAuthRepository = userAuthRepository
    this.otpService= otpService
    this.hashingService=hashingService
    this.jwtServices=jwtServices
  }

  async sendOtp(email: emailBody['email']): Promise<void> {    
    
    const otp:number = await this.otpService.generateOtp()
    console.log(`User OTP is ${otp}`);
    await this.otpService.sendOtp(email,otp)
    await this.userAuthRepository.savedOtp(email,otp)
    
  }

  async verifyOtp(email: string, otp: number): Promise<resObj | null> {

    
    const otpData = await this.userAuthRepository.verifyOtp(email)    

    if(otpData && otpData.dataValues.otp=== otp){
        return  {
          status:true,
          message:"otp verified successfully"
        }
  
    }else{
      return  {
        status:false,
        message:"Otp verification Failed"
      }
    } 
  }

  async UserRegister(data: registerBody): Promise<void> {

    const bcryptPassword = await this.hashingService.hashing(data.password)
    data.password= bcryptPassword
    
    await this.userAuthRepository.createUser(data)      
  }

  async isEmailExist(email: string): Promise<resObj | null> {
    const isEmailExist = await this.userAuthRepository.findUser(email)

    if(isEmailExist){
      return {
        status:false,
        message:"This email is already exist"
      }
    }

    return {
      status:true,
      message:"validation completed"
    }
  }


  async authenticateUser(data: loginBody): Promise<resObj | null> {

    const userData = await this.userAuthRepository.findUser(data.email)   
    
    if(userData ){
      const camparePassword = await this.hashingService.compare(data.password,userData?.dataValues.password)

      if(camparePassword){

        let payload = {
          id: userData.dataValues.id,
          userName: userData.dataValues.firstName,
          role: "user",
        };

        let token = await this.jwtServices.createToken(payload);



        return {
          status:true,
          message:'successfully authenticated',
          userData:userData,
          token
        }
      }
    }

    return {
      status:false,
      message:"Incorrect User Name and Password"
    }
  }

  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    try {
      let response = this.jwtServices.verify(token);

      if (response?.role == "user") {
        return {
          status: true,
          decoded: response,
        };
      }

      return {
        status: false,
      };
    } catch (error) {
      throw Error();
    }
  }



  

}

export default UserAuthUseCase;
