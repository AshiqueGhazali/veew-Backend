import IUserAuthRepository from '../interface/repository/IUserAuthRepository';
import { emailBody } from '../interface/controler/IUserAuthController';

class UserAuthUseCase {
  constructor(private userAuthRepository: IUserAuthRepository) {}

  async sendOtp(email: emailBody['email']): Promise<void> {
    const otp = Math.floor(1000 + Math.random() * 9000);
    
    await this.userAuthRepository.sendOtp(email, otp);
    
  }

}

export default UserAuthUseCase;
