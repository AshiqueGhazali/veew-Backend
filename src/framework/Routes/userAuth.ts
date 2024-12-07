import express, {Router} from "express"
import UserAuthController from "../../adapters/Controllers/UserAuthController";
import UserAuthUseCase from "../../usecase/UserAuthUseCase";
import UserAuthRepository from "../../adapters/Repositories/UserAuthRepository";
import authorizationMiddleware from "../middleware/user/authorization";


const router: Router = express.Router()

import OtpModel  from "../models/OtpModel";
import NotificationModel from "../models/NotificationModel";


import OtpService from "../utils/otpService";
import HashingService from "../utils/hashingService";
import JwtService from "../utils/jwtService";


const otpService = new OtpService()
const hashingService = new HashingService()
const jwtService = new JwtService()


const userAuthRepository = new UserAuthRepository(OtpModel, NotificationModel)
const userAuthUseCase = new UserAuthUseCase(userAuthRepository,otpService,hashingService,jwtService)
const userAuthController = new UserAuthController(userAuthUseCase);




router.post('/send-otp', userAuthController.sendOtp.bind(userAuthController));
router.post('/verify-otp', userAuthController.verifyOtp.bind(userAuthController))
router.post('/register',userAuthController.register.bind(userAuthController))
router.post('/login',userAuthController.login.bind(userAuthController))
router.post('/logout',userAuthController.logout.bind(userAuthController))
router.get('/getToken',authorizationMiddleware, userAuthController.getToken.bind(userAuthController))
router.post('/setForgotPasswordOtp',userAuthController.sendForgotPasswordOtp.bind(userAuthController))
router.post('/verifyForgotPasswordOtp',userAuthController.sendForgotPasswordOtp.bind(userAuthController))
router.post('/resetPassword',userAuthController.resetPassword.bind(userAuthController))
// router.post('/getAllPlans',userAuthController.googleAuth.bind(userAuthController))
router.post("/googleAuth",userAuthController.googleAuth.bind(userAuthController))



export default router;