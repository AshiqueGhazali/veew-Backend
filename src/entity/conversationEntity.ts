export interface IConversation {
    id:string;
    firstUserId:string;
    secondUserId:string;
    createdAt?:Date;
    updatedAt?:Date
}

export interface IConversationCreationAttributes extends Omit<IConversation,"id">{}