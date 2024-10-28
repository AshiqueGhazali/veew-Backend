import { resObj } from "./IUserAuthUseCase";

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
}