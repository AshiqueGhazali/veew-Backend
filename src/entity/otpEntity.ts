export interface IOtp {
  id: string;
  email: string;
  otp: number;
  expiresAt: Date;
}

export interface IOtpCreationAttributes extends Omit<IOtp, "id"> {}
