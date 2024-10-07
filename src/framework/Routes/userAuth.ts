import express, {Request, Response, Router} from "express"
import UserAuthController from "../../adapters/Controllers/UserAuthController";
import UserAuthUseCase from "../../usecase/UserAuthUseCase";
import UserAuthRepository from "../../adapters/Repositories/UserAuthRepository";

const router: Router = express.Router()

import OtpModel  from "../models/OtpModel";

import OtpService from "../utils/otpService";
import HashingService from "../utils/HashingService";


const otpService = new OtpService()
const hashingService = new HashingService()


const userAuthRepository = new UserAuthRepository(OtpModel)
const userAuthUseCase = new UserAuthUseCase(userAuthRepository,otpService,hashingService)
const userAuthController = new UserAuthController(userAuthUseCase);




router.post('/send-otp', userAuthController.sendOtp.bind(userAuthController));
router.post('/verify-otp', userAuthController.verifyOtp.bind(userAuthController))
router.post('/register',userAuthController.register.bind(userAuthController))
router.post('/login',userAuthController.login.bind(userAuthController))


export default router;