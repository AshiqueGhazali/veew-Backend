export interface ITicket {
    id:string;
    ticketCode:string;
    userId:string;
    eventId:string;
    amount:number;
    isCancelled?:boolean
}

export interface ITicketCreationAttributes extends Omit<ITicket, "id">{}