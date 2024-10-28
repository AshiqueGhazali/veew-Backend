import { NextFunction, Response } from "express";
import { IAuthRequest } from "./IUserController";

export default interface IEventController{
    createEvent(req:IAuthRequest, res:Response , next: NextFunction):Promise<void>
}