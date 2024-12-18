export interface IMessageEntity{
    id:string,
    conversationId:string,
    senderId:string;
    receiverId:string;
    message:string;
    createdAt?:Date,
    updateAt?:Date
}

export interface IMessageEntityCreationAttributes extends Omit<IMessageEntity,"id">{}