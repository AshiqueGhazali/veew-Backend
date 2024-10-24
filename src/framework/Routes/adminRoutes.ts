import express, { Router } from "express";
import AdminRepository from "../../adapters/Repositories/AdminRepository";
import AdminUseCase from "../../usecase/AdminUseCase";
import AdminController from "../../adapters/Controllers/AdminController";
import JwtService from "../utils/jwtService";
import authorizationMiddleware from "../middleware/admin/adminAuthorization";
import UserSubscriptionModel from "../models/UserSubscriptionModel";


import UserModel from "../models/UserModel"
import Pricing from "../models/PricingModel";

const adminRoutes: Router = express.Router()

const jwtService = new JwtService()


const adminRepository = new AdminRepository(UserModel, Pricing, UserSubscriptionModel)
const adminUseCase = new AdminUseCase(adminRepository,jwtService)
const adminController = new AdminController(adminUseCase)


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

export default adminRoutes