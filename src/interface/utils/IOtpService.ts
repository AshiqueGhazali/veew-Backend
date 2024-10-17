export interface IOtpService {
  generateOtp(): number;
  sendOtp(email: string, otp: number): Promise<void>;
}
