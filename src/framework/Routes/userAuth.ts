import express, {Request, Response, Router} from "express"
import UserAuthController from "../../adapters/Controllers/UserAuthController";
import UserAuthUseCase from "../../usecase/UserAuthUseCase";
import UserAuthRepository from "../../adapters/Repositories/UserAuthRepository";

const router: Router = express.Router()

import OtpModel  from "../models/OtpModel";

import OtpService from "../utils/otpService";
import HashingService from "../utils/hashingService";
import JwtService from "../utils/jwtService";


const otpService = new OtpService()
const hashingService = new HashingService()
const jwtService = new JwtService()


const userAuthRepository = new UserAuthRepository(OtpModel)
const userAuthUseCase = new UserAuthUseCase(userAuthRepository,otpService,hashingService,jwtService)
const userAuthController = new UserAuthController(userAuthUseCase);




router.post('/send-otp', userAuthController.sendOtp.bind(userAuthController));
router.post('/verify-otp', userAuthController.verifyOtp.bind(userAuthController))
router.post('/register',userAuthController.register.bind(userAuthController))
router.post('/login',userAuthController.login.bind(userAuthController))
router.post('/logout',userAuthController.logout.bind(userAuthController))
router.get('/getToken',userAuthController.getToken.bind(userAuthController))


export default router;