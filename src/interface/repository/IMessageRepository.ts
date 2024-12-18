import { Model } from "sequelize"
import { IConversation, IConversationCreationAttributes } from "../../entity/conversationEntity"
import { IMessageEntity, IMessageEntityCreationAttributes } from "../../entity/messageEntity"



export default interface IMessageRepository{
      storeConversation(firstUserId:string,secondUserId:string):Promise<Model<IConversation,IConversationCreationAttributes> | null>
      getConversation(userId:string):Promise<Model<IConversation,IConversationCreationAttributes>[]| null>
      storeMessage(conversationId:string,senderId:string,receiverId:string,message:string):Promise<Model<IMessageEntity, IMessageEntityCreationAttributes> | null>
      getMessage(conversationId:string):Promise<Model<IMessageEntity, IMessageEntityCreationAttributes>[]| null>
      // getUserConversation(userId:string)
}