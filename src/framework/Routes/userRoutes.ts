import express, {Router} from "express"
import UserRepository from "../../adapters/Repositories/UserRepository"
import UserUseCase from "../../usecase/UserUseCase"
import UserController from "../../adapters/Controllers/UserController"
import JwtService from "../utils/jwtService"
import UserModel from "../models/UserModel"
import authorizationMiddleware from "../middleware/user/authorization"


const userRouter: Router = express.Router()

const jwtService = new JwtService()


const userRepository = new UserRepository(UserModel)
const userUseCase = new UserUseCase(userRepository,jwtService)
const userController = new UserController(userUseCase)


userRouter.get('/getUserData', authorizationMiddleware, userController.getUserData.bind(userController))

export default userRouter