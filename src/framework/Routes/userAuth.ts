import express, {Request, Response, Router} from "express"
import UserAuthController from "../../adapters/Controllers/UserAuthController";
import UserAuthUseCase from "../../usecase/UserAuthUseCase";
import UserAuthRepository from "../../adapters/Repositories/UserAuthRepository";

const router: Router = express.Router()

import OtpModel  from "../models/OtpModel";

import OtpService from "../utils/otpService";


const otpService = new OtpService()


const userAuthRepository = new UserAuthRepository(OtpModel)
const userAuthUseCase = new UserAuthUseCase(userAuthRepository,otpService)
const userAuthController = new UserAuthController(userAuthUseCase);




router.post('/send-otp', userAuthController.sendOtp.bind(userAuthController));
router.post('/verify-otp', userAuthController.verifyOtp.bind(userAuthController))


export default router;