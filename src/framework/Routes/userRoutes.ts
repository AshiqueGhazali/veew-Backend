import express, { Router } from "express";
import UserRepository from "../../adapters/Repositories/UserRepository";
import UserUseCase from "../../usecase/UserUseCase";
import UserController from "../../adapters/Controllers/UserController";
import JwtService from "../utils/jwtService";
import UserModel from "../models/UserModel";
import authorizationMiddleware from "../middleware/user/authorization";
import upload from "../utils/multerService";
import PricingModel from "../models/PricingModel";
import Cripto from "crypto";

const userRouter: Router = express.Router();

const jwtService = new JwtService();

const userRepository = new UserRepository(UserModel, PricingModel);
const userUseCase = new UserUseCase(userRepository, jwtService);
const userController = new UserController(userUseCase);

userRouter.get("/getUserData",authorizationMiddleware,userController.getUserData.bind(userController));
userRouter.patch("/editProfile",authorizationMiddleware,userController.editUserProfile.bind(userController));
userRouter.post("/upload-img",authorizationMiddleware,upload.single("image"),userController.uploadProfileImg.bind(userController));
userRouter.get("/getAllPlans",authorizationMiddleware,userController.getAllPlans.bind(userController));
userRouter.post("/createPayment",authorizationMiddleware,userController.createPayment.bind(userController))
userRouter.post('/verifyPayment',authorizationMiddleware,userController.verifyPayment.bind(userController))



// userRouter.post('/payment/success', (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature }:any = req.body;
//     console.log('Order is is :',razorpay_order_id);
//     console.log('payment iss :',razorpay_payment_id);
//     console.log('signnnn iss :', razorpay_signature);
    
    
    

//     const crypto = require('crypto');
//     const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);

//     hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
//     const generatedSignature = hmac.digest('hex');

//     if (generatedSignature === razorpay_signature) {
//         res.status(200).json({ status: true });
//     } else {
//         res.status(400).json({ status: false });
//     }
// });

export default userRouter;
