import { Model } from "sequelize";
import IMessageUseCase from "../interface/useCase/IMessageUseCase";
import IMessageRepository from "../interface/repository/IMessageRepository";
import { IConversation, IConversationCreationAttributes } from "../entity/conversationEntity";
import { IMessageEntity, IMessageEntityCreationAttributes } from "../entity/messageEntity";
import { resObj } from "../interface/useCase/IUserAuthUseCase";

export default class MessageUseCase implements IMessageUseCase{
  private messageRepository: IMessageRepository;

  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository;
  }

  async verifyCreateConverasation(firstUserId: string, secondUserId: string): Promise<Model<IConversation,IConversationCreationAttributes> | null> {
      try {
        if(!firstUserId||!secondUserId){
            return null
         }
         return await this.messageRepository.storeConversation(firstUserId,secondUserId)
      } catch (error) {
        throw error
      }
  }

  async getConversationData(userId: string): Promise<Model<IConversation, IConversationCreationAttributes>[] | null> {
      try {
        return await this.messageRepository.getConversation(userId)
      } catch (error) {
        throw error
      }
  }

  async handleStoreMessage(converasationId: string, senderId: string, receiverId: string, message: string): Promise<Model<IMessageEntity, IMessageEntityCreationAttributes> | null> {
      try {
        return await this.messageRepository.storeMessage(converasationId,senderId,receiverId,message)
      } catch (error) {
        throw error
      }
  }

  async handleGetMessage(convrasationId: string): Promise<Model<IMessageEntity, IMessageEntityCreationAttributes>[] | null> {
      try {
        return this.messageRepository.getMessage(convrasationId)
      } catch (error) {
        throw error
      }
  }
}

