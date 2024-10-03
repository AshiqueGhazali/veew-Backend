

export default interface IUserAuthRepository {
    sendOtp(email: string, otp: number): Promise<void>;
  }
  