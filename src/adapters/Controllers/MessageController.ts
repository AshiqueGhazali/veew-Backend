import { NextFunction, Request, Response } from "express";
import IMessageController from "../../interface/controler/IMessageController";
import { IAuthRequest } from "../../interface/controler/IUserController";
import IMessageUseCase from "../../interface/useCase/IMessageUseCase";

export default class MessageController implements IMessageController {
  private messageUseCase: IMessageUseCase;

  constructor(messageUseCase: IMessageUseCase) {
    this.messageUseCase = messageUseCase;
  }

  async createConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {firstUserId , secondUserId} = req.body

        const response = await this.messageUseCase.verifyCreateConverasation(firstUserId,secondUserId)

        if(response){
            res.status(200).json(response)
            return 
        }

        res.status(401).json(response)
        return
      } catch (error) {
        res.status(500).json(error)
        return
      }
  }

  async getConversations(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        // const conversationId = req.query.converasationId as string
        const userId = req.userId as string

        const response = await this.messageUseCase.getConversationData(userId)

        if(response){
            res.status(200).json(response)
            return 
        }

        res.status(401).json(response)
        return
      } catch (error) {
        res.status(500).json(error)
        return
      }
  }

  async createMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {conversationId, senderId , receiverId,message} = req.body

        const response = await this.messageUseCase.handleStoreMessage(conversationId, senderId , receiverId,message)

        res.status(200).json(response)
        return 
      } catch (error) {
        res.status(500).json(error)
        return
      }
  }

  async getMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const conversationId = req.query.conversationId as string

        const response = await this.messageUseCase.handleGetMessage(conversationId)

        if(response){
            res.status(200).json(response)
            return 
        }

        res.status(401).json(response)
        return
      } catch (error) {
        console.log(error);
        
        res.status(500).json(error)
        return
      }
  }
}

