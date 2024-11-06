import { NextFunction, Request, Response } from "express";
import { IAuthRequest } from "./IUserController";

export default interface IEventController{
    createEvent(req:IAuthRequest, res:Response , next: NextFunction):Promise<void>
    getAllEvents(req:Request , res:Response):Promise<void>
    getCategories(req:Request , res:Response):Promise<void>
    getEventDetails(req:IAuthRequest, res:Response , next: NextFunction):Promise<void>
    getEventsOfUser(req:IAuthRequest,res:Response , next: NextFunction):Promise<void>
    editEventDetails(req:IAuthRequest,res:Response , next: NextFunction):Promise<void>
    editEventDate(req:IAuthRequest,res:Response , next: NextFunction):Promise<void>
    cancelEvent(req:IAuthRequest,res:Response , next: NextFunction):Promise<void>
}