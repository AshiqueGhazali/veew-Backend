import express, { Router } from "express";
import AdminRepository from "../../adapters/Repositories/AdminRepository";
import AdminUseCase from "../../usecase/AdminUseCase";
import AdminController from "../../adapters/Controllers/AdminController";
import JwtService from "../utils/jwtService";
import authorizationMiddleware from "../middleware/admin/adminAuthorization";
import UserSubscriptionModel from "../models/UserSubscriptionModel";
import EventModel from "../models/EventModel";
import TicketModel from "../models/TicketModel";
import WalletModel from "../models/WalletModel";
import TransactionModel from "../models/TransactionModel";
import NotificationModel from "../models/NotificationModel";




import UserModel from "../models/UserModel"
import Pricing from "../models/PricingModel";
import EventRepository from "../../adapters/Repositories/EventRepository";
import EventUseCase from "../../usecase/EventUseCase";
import EventController from "../../adapters/Controllers/EventController";
import StripePayment from "../utils/stripePayments";

const adminRoutes: Router = express.Router()

const jwtService = new JwtService()
const stripePayment =new StripePayment()



const adminRepository = new AdminRepository(UserModel, Pricing, UserSubscriptionModel , EventModel , TicketModel , TransactionModel, NotificationModel)
const adminUseCase = new AdminUseCase(adminRepository,jwtService)
const adminController = new AdminController(adminUseCase)

const eventRepository = new EventRepository(EventModel,UserModel,TicketModel,WalletModel,TransactionModel, NotificationModel)
const eventUseCase = new EventUseCase(eventRepository,stripePayment)
const eventController = new EventController(eventUseCase)


adminRoutes.post('/login',adminController.login.bind(adminController))
adminRoutes.get('/getToken',adminController.getToken.bind(adminController))
adminRoutes.post('/logout',adminController.logout.bind(adminController))

adminRoutes.get('/getUsersData',authorizationMiddleware, adminController.getAllUsers.bind(adminController))
adminRoutes.post('/blockUser',authorizationMiddleware, adminController.blockUser.bind(adminController))
adminRoutes.post('/addPlan',authorizationMiddleware, adminController.addPricingPlan.bind(adminController))
adminRoutes.get('/getPlan',authorizationMiddleware, adminController.getPricingPlans.bind(adminController))
adminRoutes.put('/updatePlan',adminController.editPricingPlan.bind(adminController))
adminRoutes.delete('/deletePlan',authorizationMiddleware,adminController.deletePlan.bind(adminController))
adminRoutes.get('/getAllSubscribers',authorizationMiddleware,adminController.getAllSubscribers.bind(adminController))
adminRoutes.get('/getDataCounts',authorizationMiddleware,eventController.getDataCounts.bind(eventController))
adminRoutes.get('/getDashboardData',authorizationMiddleware,adminController.getDashboardDatas.bind(adminController))

// admin event management
adminRoutes.get('/getAllEvents',authorizationMiddleware,eventController.getAllEvents.bind(eventController))
adminRoutes.get('/getAllCategoris',authorizationMiddleware,eventController.getCategories.bind(eventController))
adminRoutes.patch('/cancellEvent',authorizationMiddleware,eventController.cancelEvent.bind(eventController))

// admin ticket management
adminRoutes.get("/getAllTickets",authorizationMiddleware,eventController.getAllTicketsData.bind(eventController))

export default adminRoutes