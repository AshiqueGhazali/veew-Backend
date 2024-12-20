import express, { Router } from "express";
import UserRepository from "../../adapters/Repositories/UserRepository";
import UserUseCase from "../../usecase/UserUseCase";
import UserController from "../../adapters/Controllers/UserController";
import JwtService from "../utils/jwtService";
import UserModel from "../models/UserModel";
import authorizationMiddleware from "../middleware/user/authorization";
import upload from "../utils/multerService";
import PricingModel from "../models/PricingModel";
import StripePayment from "../utils/stripePayments";
import UserSubscriptionModel from "../models/UserSubscriptionModel";
import EventRepository from "../../adapters/Repositories/EventRepository";
import EventModel from "../models/EventModel";
import EventUseCase from "../../usecase/EventUseCase";
import EventController from "../../adapters/Controllers/EventController";

import WalletModel from "../models/WalletModel";
import TransactionModel from "../models/TransactionModel";
import TicketModel from "../models/TicketModel";
import NotificationModel from "../models/NotificationModel";
import LiveStatusModel from "../models/LiveStatusModel";
import LikesModel from "../models/LikesModel";
import CommentsModel from "../models/CommentsModel";
import UserReportModel from "../models/UserReportModel";
import EventReportModel from "../models/EventReportModel";




const userRouter: Router = express.Router();

const jwtService = new JwtService();
const stripePayment =new StripePayment()

const eventRepository = new EventRepository(
  EventModel,
  UserModel,
  TicketModel,
  WalletModel,
  TransactionModel,
  NotificationModel,
  LiveStatusModel,
  LikesModel,
  CommentsModel,
  UserReportModel,
  EventReportModel
);
const eventUseCase = new EventUseCase(eventRepository, stripePayment);
const eventController = new EventController(eventUseCase);

const userRepository = new UserRepository(
  UserModel,
  PricingModel,
  UserSubscriptionModel,
  WalletModel,
  TransactionModel,
  NotificationModel
);
const userUseCase = new UserUseCase(
  userRepository,
  jwtService,
  stripePayment,
  eventRepository
);
const userController = new UserController(userUseCase);



userRouter.get("/getUserData",authorizationMiddleware,userController.getUserData.bind(userController));
userRouter.patch("/editProfile",authorizationMiddleware,userController.editUserProfile.bind(userController));
userRouter.post("/upload-img",authorizationMiddleware,upload.single("image"),userController.uploadProfileImg.bind(userController));
userRouter.get("/getAllPlans",authorizationMiddleware,userController.getAllPlans.bind(userController));
userRouter.post("/createPayment",authorizationMiddleware,userController.createPayment.bind(userController));
userRouter.post("/subscribePlan",authorizationMiddleware,userController.conformSubscription.bind(userController));
userRouter.get("/getPlanOfUser",authorizationMiddleware,userController.getUserSubscriptionPlan.bind(userController));
userRouter.get('/getDataCounts',authorizationMiddleware,eventController.getDataCounts.bind(eventController))
userRouter.get('/getNotifications',authorizationMiddleware,userController.getUserNotification.bind(userController))
userRouter.get('/getProfileStatus',authorizationMiddleware,userController.getProfileStatus.bind(userController))
userRouter.get('/getUserDataById',authorizationMiddleware,userController.getUserDataById.bind(userController))


// event controller routes :
userRouter.post('/createEvent',authorizationMiddleware,upload.single("image"),eventController.createEvent.bind(eventController));
userRouter.get("/getAllEvents",eventController.getAllEvents.bind(eventController));
userRouter.get("/getAllCategories",eventController.getCategories.bind(eventController));
userRouter.get("/getEventDetails",authorizationMiddleware,eventController.getEventDetails.bind(eventController));
userRouter.get("/getHostedEvents",authorizationMiddleware,eventController.getEventsOfUser.bind(eventController));
userRouter.patch("/editEventDetails",authorizationMiddleware,eventController.editEventDetails.bind(eventController));
userRouter.patch("/editEventDate",authorizationMiddleware,eventController.editEventDate.bind(eventController));
userRouter.patch("/cancelEvent",authorizationMiddleware,eventController.cancelEvent.bind(eventController))
userRouter.post("/setEventStartTime",authorizationMiddleware,eventController.setEventStartTime.bind(eventController))
userRouter.post("/setEventEndTime",authorizationMiddleware,eventController.setEventEndTime.bind(eventController))
userRouter.get("/getEventLiveUpdates",authorizationMiddleware,eventController.getEventUpdates.bind(eventController))



// user wallet controller routes :
userRouter.get("/getUserWallet",authorizationMiddleware,userController.getWallet.bind(userController))
userRouter.post("/addAmountToWallet",authorizationMiddleware,userController.addFundTowallet.bind(userController))
userRouter.post("/conformWalletAmount",authorizationMiddleware,userController.conformWalletCredit.bind(userController))
userRouter.get("/getWalletTransactions",authorizationMiddleware,userController.getWalletTransactions.bind(userController))

// user ticket controlling routes :
userRouter.post("/payForTicket",authorizationMiddleware,eventController.bookTicket.bind(eventController))
userRouter.post("/conformTicketBooking",authorizationMiddleware,eventController.conformTicketBooking.bind(eventController))
userRouter.post("/bookTicketWithWallet",authorizationMiddleware,eventController.bookTicketWithWallet.bind(eventController))
userRouter.get("/getAllUserTickets",authorizationMiddleware,eventController.getAllUserTickets.bind(eventController))
userRouter.post("/cancellTicket",authorizationMiddleware,eventController.userCancelTicket.bind(eventController))
userRouter.get("/getAllTicketForEvent",authorizationMiddleware,eventController.getAllTicketForEvent.bind(eventController))

// event start routes :
userRouter.get("/startEvent",authorizationMiddleware,eventController.startEvent.bind(eventController))
userRouter.get("/verifyEventJoining",authorizationMiddleware,eventController.verifyEventJoining.bind(eventController))

// like and comment management :
userRouter.post("/addLike",authorizationMiddleware,eventController.addLike.bind(eventController))
userRouter.post("/removeLike",authorizationMiddleware,eventController.removeLike.bind(eventController))
userRouter.get("/getLikedEventsId",authorizationMiddleware,eventController.getLikedEventsId.bind(eventController))
userRouter.post("/addNewComment",authorizationMiddleware,eventController.addComment.bind(eventController))
userRouter.get("/getEventComments",authorizationMiddleware,eventController.getEventComments.bind(eventController))
userRouter.delete("/deleteComment",authorizationMiddleware,eventController.removeComment.bind(eventController))


userRouter.post("/reportUser",authorizationMiddleware,eventController.reportUser.bind(eventController))
userRouter.post("/reportEvent",authorizationMiddleware,eventController.reportEvent.bind(eventController))



export default userRouter;
