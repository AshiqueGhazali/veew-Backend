import { Model } from "sequelize";
import { resObj } from "./IUserAuthUseCase";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";
import { ITicket, ITicketCreationAttributes } from "../../entity/ticketEntity";
import { IComments, ICommentsCreationAttributes } from "../../entity/commentsEntity";
import { IILiveStatusCreationAttributes, ILiveStatus } from "../../entity/liveStatus";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";

export interface createEventParams{
    eventTitle : string;
    category : string;
    description : string;
    date : Date;
    startTime : string;
    endTime : string;
    participantCount : number;
    ticketPrice : number;
    imageUrl : string;
}

export interface editEventDetailsParams {
    eventTitle : string;
    description : string;
    ticketPrice : number;
}

export interface editEventDateParams {
    date : Date;
    startTime : string;
    endTime : string;
}

export interface startEventRes extends resObj {
    eventMeetUrl?:string
}

export interface dataCountResponse {
    totalUsers:number;
    totalUpcomingEvents:number;
    totalExpairedEvents:number;
    totalSubscribers:number;
    totalTickets:number
}

export interface IAddCommentParms {
    eventId:string;
    userId:string;
    comment:string;
    parentId:string | null
}

export interface IReportUserParams {
    reporterId:string;
    reportedUserId:string;
    reason:string
}

export default interface IEventUseCase {
    verifyEventCreation(userId:string,data:createEventParams):Promise<resObj|null>
    getAllEvents():Promise<Model<IEvent,IEventCreationAttributes>[] | null>
    findAllCategories():Promise<string[] | null>
    verityEvent(eventId:string):Promise<Model<IEvent,IEventCreationAttributes> | null>
    verifyUserEvents(userId:string):Promise<Model<IEvent,IEventCreationAttributes>[] | null>
    verifyEditEventDetails(eventId:string , data : editEventDetailsParams):Promise<resObj|null>
    verifyEditEventDate(eventId:string , data : editEventDateParams):Promise<resObj|null>
    verifyEventCancellation(eventId:string):Promise<resObj|null>
    verifyTicketBooking(userId:string,eventId:string):Promise<any>
    conformTicketBooket(userId:string,eventId:string,sessionId:string):Promise<resObj|null>;
    verifyTicketBookingWithWallet(userId:string,eventId:string):Promise<resObj|null>
    getAllTicketsData():Promise<Model<ITicket,ITicketCreationAttributes>[] | null>
    getAllUserTickets(userId:string):Promise<Model<ITicket,ITicketCreationAttributes>[] | null>;
    userCancelTicket(userId:string , ticketId : string):Promise<resObj|null>;
    getAllTicketForEvent(eventId:string):Promise<Model<ITicket,ITicketCreationAttributes>[] | null>;
    verifyStartEvent(userId:string , eventId:string):Promise<startEventRes | null>
    verifyEventJoining(meetUrl:string,userId:string):Promise<resObj | null>
    getDataCounts():Promise<dataCountResponse | null>
    setStartTime(eventId:string,startTime:string):Promise<void>
    updateEndTime(eventId:string,endTime:string):Promise<void>
    addLike(eventId:string, userId:string):Promise<resObj | null>
    removeLike(eventId:string, userId:string):Promise<resObj | null>
    getLikedEventsId(userId:string):Promise<string[]|null>
    addNewComment(data:IAddCommentParms):Promise<resObj | null>
    getEventComments(eventId:string):Promise<Model<IComments,ICommentsCreationAttributes>[] | null>
    removeComment(commentId:string, userId:string):Promise<resObj | null>
    getAdminEventApprovals():Promise<Model<ILiveStatus,IILiveStatusCreationAttributes>[] | null>
    approveEventsFund(eventId:string):Promise<resObj | null>
    verifyReportUser(data:IReportUserParams):Promise<resObj | null>
    getReportedUsersWithReporters():Promise<Model<IUser, IUserCreationAttributes>[] | null>
    
}