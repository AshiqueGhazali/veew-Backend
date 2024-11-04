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

export default interface IEventUseCase {
    verifyEventCreation(userId:string,data:createEventParams):Promise<resObj|null>
    getAllEvents():Promise<Model<IEvent,IEventCreationAttributes>[] | null>
    findAllCategories():Promise<string[] | null>
    verityEvent(eventId:string):Promise<Model<IEvent,IEventCreationAttributes> | null>
    verifyUserEvents(userId:string):Promise<Model<IEvent,IEventCreationAttributes>[] | null>
}