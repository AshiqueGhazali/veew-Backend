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
    bookTicket(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>;
    conformTicketBooking(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>;
    bookTicketWithWallet(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>;
    getAllTicketsData(req:Request , res:Response):Promise<void>
    getAllUserTickets(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>;
    userCancelTicket(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>;
    getAllTicketForEvent(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>;
    startEvent(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    verifyEventJoining(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    getDataCounts(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    setEventStartTime(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    setEventEndTime(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    addLike(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    removeLike(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    getLikedEventsId(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    addComment(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    getEventComments(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    removeComment(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
    getAdminEventApprovals(req:Request , res:Response):Promise<void>
    appruveFund(req:Request , res:Response):Promise<void>
    reportUser(req:IAuthRequest, res:Response, next: NextFunction):Promise<void>
}