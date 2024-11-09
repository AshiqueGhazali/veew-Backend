import { Model } from "sequelize";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";
import { createEventParams, editEventDateParams, editEventDetailsParams } from "../useCase/IEventUseCase";
import { ITicket, ITicketCreationAttributes } from "../../entity/ticketEntity";
import { transactionParams } from "./IUserRepository";
import { ITransaction, ITransactionCreationAttributes } from "../../entity/transactionEntity";
import { IWallet, IWalletCreationAttributes } from "../../entity/walletEntity";

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
}