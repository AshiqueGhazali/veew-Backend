import express, { Router } from "express";
import UserModel from "../models/UserModel"
import AdminRepository from "../../adapters/Repositories/AdminRepository";
import AdminUseCase from "../../usecase/AdminUseCase";
import AdminController from "../../adapters/Controllers/AdminController";
import JwtService from "../utils/jwtService";
import authorizationMiddleware from "../middleware/admin/adminAuthorization";

const adminRoutes: Router = express.Router()

const jwtService = new JwtService()


const adminRepository = new AdminRepository(UserModel)
const adminUseCase = new AdminUseCase(adminRepository,jwtService)
const adminController = new AdminController(adminUseCase)


adminRoutes.post('/login',adminController.login.bind(adminController))
adminRoutes.get('/getToken',adminController.getToken.bind(adminController))
adminRoutes.post('/logout',adminController.logout.bind(adminController))

adminRoutes.get('/getUsersData',authorizationMiddleware, adminController.getAllUsers.bind(adminController))
adminRoutes.post('/blockUser',adminController.blockUser.bind(adminController))

export default adminRoutes