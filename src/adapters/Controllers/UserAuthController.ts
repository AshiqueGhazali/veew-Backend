import { Request, Response } from "express";
import UserAuthUseCase from "../../usecase/UserAuthUseCase";
import UserAuthRepository from "../Repositories/UserAuthRepository";
import IUserAuthUseCase from "../../interface/useCase/IUserAuthUseCase";
import IUserAuthController, { emailBody } from "../../interface/controler/IUserAuthController";





class UserAuthController implements IUserAuthController {
    
    private userAuthUseCase:IUserAuthUseCase;

    constructor(userAuthUseCase:IUserAuthUseCase) {
        this.userAuthUseCase=userAuthUseCase
    }
    

async sendOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

        try {
            await this.userAuthUseCase.sendOtp(email);
            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to send OTP' });
        }
}
 
}

export default UserAuthController;
