export interface IEvent {
    id : string;
    hostsId :string; 
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

export interface IEventCreationAttributes extends Omit<IEvent, "id">{}