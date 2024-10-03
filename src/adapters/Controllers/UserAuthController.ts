import { Request, Response } from "express";
import UserAuthUseCase from "../../usecase/UserAuthUseCase";
import UserAuthRepository from "../Repositories/UserAuthRepository";
import IUserAuthUseCase from "../../interface/useCase/IUserAuthUseCase";
import IUserAuthController, { emailBody } from "../../interface/controler/IUserAuthController";
import app from "../../framework/config/app";





class UserAuthController implements IUserAuthController {
    
    private userAuthUseCase:IUserAuthUseCase;

    constructor(userAuthUseCase:IUserAuthUseCase) {
        this.userAuthUseCase=userAuthUseCase
    }
    

    async sendOtp(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

            try {
                await this.userAuthUseCase.sendOtp(email);
                app.locals.email=email
                res.status(200).json({ message: 'OTP sent successfully' });            
            } catch (error) {
                res.status(500).json({ message: 'Failed to send OTP' });
            }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const otp = req.body.userOtp        
        

        try{
           
            const status = await this.userAuthUseCase.verifyOtp(app.locals.email,otp)
                     
 
            if(status?.status){
                res.status(200).json({success:true,messega:status.message})
            }else{
                res.status(401).json({message:"otp verification false"})
            }
        }catch(err){
            console.log(err);
            
        }
    }
 
}

export default UserAuthController;
