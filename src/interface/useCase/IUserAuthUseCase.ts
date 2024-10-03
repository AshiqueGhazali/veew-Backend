import { Request, Response } from "express";


export default interface IUserAuthUseCase{
   sendOtp(email:string):Promise<void>
}