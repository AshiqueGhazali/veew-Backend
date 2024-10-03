import express, {Request, Response, Router} from "express"
import UserAuthController from "../../adapters/Controllers/UserAuthController";
import UserAuthUseCase from "../../usecase/UserAuthUseCase";
import UserAuthRepository from "../../adapters/Repositories/UserAuthRepository";

const router: Router = express.Router()


const userAuthRepository = new UserAuthRepository()
const userAuthUseCase = new UserAuthUseCase(userAuthRepository)
const userAuthController = new UserAuthController(userAuthUseCase);




router.post('/send-otp', (req, res) => userAuthController.sendOtp(req, res));


export default router;