import { Router } from "express";
import MessageController from "../../adapters/Controllers/MessageController";
import MessageUseCase from "../../usecase/MessageUseCase";
import MessageRepository from "../../adapters/Repositories/MessageRepository";
import MessageModel from "../models/MessageModel";
import ConversationModel from "../models/ConversationModel";
import authorizationMiddleware from "../middleware/user/authorization";


const messageRouter = Router();
const messageRepository = new MessageRepository(ConversationModel, MessageModel);
const messageUseCase = new MessageUseCase(messageRepository);
const messageController = new MessageController(messageUseCase);

messageRouter.post("/createConversation",authorizationMiddleware, messageController.createConversation.bind(messageController));
messageRouter.get("/getConverasation",authorizationMiddleware, messageController.getConversations.bind(messageController));
messageRouter.post("/storeMessage",authorizationMiddleware, messageController.createMessage.bind(messageController))
messageRouter.get("/getMessage",authorizationMiddleware, messageController.getMessage.bind(messageController))

export default messageRouter;
