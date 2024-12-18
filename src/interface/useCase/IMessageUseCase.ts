import { Model } from "sequelize"
import { IConversation, IConversationCreationAttributes } from "../../entity/conversationEntity"
import { IMessageEntity, IMessageEntityCreationAttributes } from "../../entity/messageEntity"
import { resObj } from "./IUserAuthUseCase"


export default interface IMessageUseCase {
    verifyCreateConverasation(firstUserId:string,secondUserId:string):Promise<Model<IConversation,IConversationCreationAttributes> | null>
    getConversationData(userId:string):Promise<Model<IConversation,IConversationCreationAttributes>[] | null>
    handleStoreMessage(converasationId:string,senderId:string,receiverId:string,message:string):Promise<Model<IMessageEntity, IMessageEntityCreationAttributes> | null>
    handleGetMessage(convrasationId:string):Promise<Model<IMessageEntity, IMessageEntityCreationAttributes>[]| null>
}