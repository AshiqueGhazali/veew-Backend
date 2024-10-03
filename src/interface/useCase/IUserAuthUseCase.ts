import { Request, Response } from "express";
import { IUser } from "../../entity/userEntity";

export  interface resObj{
   status:boolean,
   message:string,
   token?:string,
   userData?:IUser,
}


export default interface IUserAuthUseCase{
   sendOtp(email:string):Promise<void>
   verifyOtp(email:string,otp:number):Promise<resObj|null>
}