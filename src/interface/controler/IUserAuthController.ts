import { Request, Response } from "express";

export interface emailBody {
  email: string;
}

export interface tokenData {
  id: string;
  userName?: string;
  role: string;
}

export interface googleAuthBody{
  email:string,
  firstName:string,
  lastName:string
  image:string
}

export default interface IUserAuthController {
  sendOtp(req: Request, res: Response): Promise<void>;
  sendForgotPasswordOtp(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  verifyForgotPasswordOtp(req: Request, res: Response): Promise<void>;
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  getToken(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  googleAuth(req:Request,res:Response):Promise<void>
}
