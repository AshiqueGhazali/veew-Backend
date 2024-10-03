import { Request, Response } from "express";


export interface emailBody {
    email: string;
  }
  
  export default interface IUserAuthController {
    sendOtp(req:Request,res:Response):Promise<void>;
    verifyOtp(req:Request,res:Response):Promise<void>
  }
  