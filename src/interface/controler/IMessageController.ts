import { NextFunction, Request, Response } from "express";
import { IAuthRequest } from "./IUserController";

export default interface IMessageController {
    createConversation(req:Request,res:Response,next:NextFunction):Promise<void>
    getConversations(req:IAuthRequest,res:Response,next:NextFunction):Promise<void>
    // doctorGetConversation(req:IAuthRequest,res:Response,next:NextFunction):Promise<void>
    createMessage(req:Request,res:Response,next:NextFunction):Promise<void>
    getMessage(req:Request,res:Response,next:NextFunction):Promise<void>
}