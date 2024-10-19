import { Request, Response } from "express";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import { Model } from "sequelize";
import { googleAuthBody } from "../controler/IUserAuthController";

export interface resObj {
  status: boolean;
  message: string;
  token?: string;
  userData?: Model<IUser, IUserCreationAttributes>;
}

export interface registerBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyTokenResponse {
  status: boolean;
  decoded?: object;
}

export interface loginBody {
  email: string;
  password: string;
}

export interface VerifyTokenResponse {
  status: boolean;
  decoded?: object;
}

export default interface IUserAuthUseCase {
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: number): Promise<resObj | null>;
  verifyForgotPasswordOtp(email: string, otp: number): Promise<resObj | null>;
  UserRegister(data: registerBody): Promise<void>;
  isEmailExist(email: string): Promise<resObj | null>;
  authenticateUser(data: loginBody): Promise<resObj | null>;
  verifyToken(token: string): Promise<VerifyTokenResponse>;
  userResetPassword(email: string, password: string): Promise<resObj | null>;
  googleAuthenticateUser(data:googleAuthBody):Promise<resObj|null>

}
