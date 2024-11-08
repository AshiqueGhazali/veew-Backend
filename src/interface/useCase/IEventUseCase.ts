import { Model } from "sequelize";
import { resObj } from "./IUserAuthUseCase";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";

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
}