import { Model, ModelDefined, Op } from "sequelize";
import IMessageRepository from "../../interface/repository/IMessageRepository";
import {
  IConversation,
  IConversationCreationAttributes,
} from "../../entity/conversationEntity";
import {
  IMessageEntity,
  IMessageEntityCreationAttributes,
} from "../../entity/messageEntity";

export default class MessageRepository implements IMessageRepository {
  private ConversationModel: ModelDefined<IConversation,IConversationCreationAttributes>;
  private MessageModel: ModelDefined<IMessageEntity,IMessageEntityCreationAttributes>;

  constructor(
    ConversationModel: ModelDefined<IConversation,IConversationCreationAttributes>,
    MessageModel: ModelDefined<IMessageEntity, IMessageEntityCreationAttributes>
  ) {
    this.ConversationModel = ConversationModel
    this.MessageModel = MessageModel;
  }
  
  async storeConversation(firstUserId:string,secondUserId:string): Promise<Model<IConversation, IConversationCreationAttributes> | null> {
      try {
        const conversation = await this.ConversationModel.create({firstUserId , secondUserId})
        return conversation

      } catch (error) {
        throw error
      }
  }

  async getConversation(userId: string): Promise<Model<IConversation, IConversationCreationAttributes>[] | null> {
      try {
        const conversations = await this.ConversationModel.findAll({
          where: {
            [Op.or]: [
              {
                firstUserId: userId,
              },
              {
                secondUserId: userId,
              },
            ],
          },
        });

        return conversations
      } catch (error) {
        throw error
      }
  }

  async storeMessage(conversationId: string, senderId: string,receiverId:string, message: string): Promise<Model<IMessageEntity, IMessageEntityCreationAttributes> | null> {
      try {
        const newMessage = await this.MessageModel.create({
            conversationId,
            senderId,
            receiverId,
            message
        })

        console.log("new  message is:",newMessage);
        

        return newMessage
      } catch (error) {
        throw error
      }
  }

  async getMessage(conversationId: string): Promise<Model<IMessageEntity, IMessageEntityCreationAttributes>[] | null> {
      try {
        const message = await this.MessageModel.findAll({where:{
            conversationId
        }})

        return message
      } catch (error) {
        throw error
      }
  }
}
