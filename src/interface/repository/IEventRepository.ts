import { Model } from "sequelize";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";
import { createEventParams, dataCountResponse, editEventDateParams, editEventDetailsParams, IAddCommentParms, IReportEventParams, IReportUserParams, startEventRes } from "../useCase/IEventUseCase";
import { ITicket, ITicketCreationAttributes } from "../../entity/ticketEntity";
import { transactionParams } from "./IUserRepository";
import { ITransaction, ITransactionCreationAttributes } from "../../entity/transactionEntity";
import { IWallet, IWalletCreationAttributes } from "../../entity/walletEntity";
import { INotification, INotificationCreationAttributes } from "../../entity/notificationsEntity";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import { IComments, ICommentsCreationAttributes } from "../../entity/commentsEntity";
import { IILiveStatusCreationAttributes, ILiveStatus } from "../../entity/liveStatus";
import { IUserReport, IUserReportCreationAttributes } from "../../entity/userReportEntity";
import { IEventReport, IEventReportCreationAttributes } from "../../entity/eventReportEntity";

export interface createTicketParams {
    ticketCode:string
    userId:string,
    eventId:string,
    amount:number
}

export default interface IEventRepository {
    createEvent(userId:string, data:createEventParams):Promise<Model<IEvent,IEventCreationAttributes> | null>
    getAllEvents():Promise<Model<IEvent,IEventCreationAttributes>[] | null>
    getUniqueCategories():Promise<string[] | null>
    fetchEventDetails(eventId:string):Promise<Model<IEvent,IEventCreationAttributes> | null>
    fetchUserEvents(userId:string):Promise<Model<IEvent,IEventCreationAttributes>[] | null>
    editEventDetails(eventId:string , data : editEventDetailsParams):Promise<void>
    editEventDate(eventId:string , data:editEventDateParams):Promise<void>
    cancellEvent(eventId:string):Promise<void>
    createTicket(data:createTicketParams):Promise<Model<ITicket,ITicketCreationAttributes> | null>
    createTransactions(data:transactionParams):Promise<Model<ITransaction,ITransactionCreationAttributes>|null>
    getUserWallet(userId:string):Promise<Model<IWallet,IWalletCreationAttributes>|null>;
    checkUserTicket(userId:string,eventId:string):Promise<Model<ITicket,ITicketCreationAttributes> | null>
    updateWalletAmount(userId:string , amount:number):Promise<void>
    getAllTicketForEvent(eventId:string):Promise<Model<ITicket,ITicketCreationAttributes>[] | null>
    getAllTicketData():Promise<Model<ITicket,ITicketCreationAttributes>[] | null>
    getAllUserTickets(userId:string):Promise<Model<ITicket,ITicketCreationAttributes>[] | null>;
    userCancelTicket(ticketId:string):Promise<void>;
    findTicketById(ticketId:string):Promise<Model<ITicket,ITicketCreationAttributes> | null>
    saveMeetUrl(eventId:string , eventMeetUrl:string):Promise<void>
    getEventByMeetLink(meetURL:string):Promise<Model<IEvent,IEventCreationAttributes> | null>
    getDataCounts():Promise<dataCountResponse | null>
    createNotification(userId:string,notificationHead:string,notification:string):Promise<Model<INotification,INotificationCreationAttributes>>
    setEventStartTime(eventId:string , startTime:string):Promise<void>
    setEventEndTime(eventId:string , endTime:string, approvedAmount:number):Promise<void>
    findUser(userId:string):Promise<Model<IUser,IUserCreationAttributes> | null>
    AddLike(eventId:string , userId:string):Promise<void>
    removeLike(eventId:string , userId:string):Promise<void>
    getLikedEventIds(userId:string):Promise<string[] | null>
    addComment(data:IAddCommentParms):Promise<void>
    findEventComments(eventId:string):Promise<Model<IComments,ICommentsCreationAttributes>[] | null>
    deleteComment(commentId:string):Promise<void>
    findCommentById(commentId:string):Promise<Model<IComments,ICommentsCreationAttributes> | null>
    getAdminEventApprovals():Promise<Model<ILiveStatus,IILiveStatusCreationAttributes>[] | null>
    getTotalTicketAmountForEvent(eventId:string):Promise<number>
    updateApprovalStatus(eventId:string):Promise<void>
    reportUser(data:IReportUserParams):Promise<Model<IUserReport,IUserReportCreationAttributes> | null>
    reportEvent(data:IReportEventParams):Promise<Model<IEventReport,IEventReportCreationAttributes> | null>
    getReportedUsersWithReporters():Promise<Model<IUser, IUserCreationAttributes>[] | null>
    getReportedEventsWithReporters():Promise<Model<IEvent, IEventCreationAttributes>[] | null>
    getEventUpdation(eventId:string):Promise<Model<ILiveStatus, IILiveStatusCreationAttributes> | null>
}