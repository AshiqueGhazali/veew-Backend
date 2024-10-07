import { Request, Response } from "express";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import { Model } from "sequelize";

export  interface resObj{
   status:boolean,
   message:string,
   token?:string,
   userData?:Model<IUser,IUserCreationAttributes>,
}

export interface registerBody {
   firstName:string,
   lastName:string,
   email:string,
   password:string
}


export interface loginBody {
   email:string;
   password:string
}

export default interface IUserAuthUseCase{
   sendOtp(email:string):Promise<void>
   verifyOtp(email:string,otp:number):Promise<resObj|null>
   UserRegister(data:registerBody):Promise<void>
   isEmailExist(email:string):Promise<resObj|null>
   authenticateUser(data:loginBody):Promise<resObj|null>
}