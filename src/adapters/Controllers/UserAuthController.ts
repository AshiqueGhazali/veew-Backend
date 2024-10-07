import { Request, Response } from "express";
import IUserAuthUseCase, { loginBody, registerBody } from "../../interface/useCase/IUserAuthUseCase";
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
            const authenticateUser = await this.userAuthUseCase.isEmailExist(email)

            if(!authenticateUser?.status){
                res.status(401).json({message:authenticateUser?.message})
                return
            }

            await this.userAuthUseCase.sendOtp(email);
            app.locals.email=email
            res.status(200).json({ message: 'OTP sent successfully' }); 
                       
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const otp = req.body.userOtp        
        

        try{
           
            const status = await this.userAuthUseCase.verifyOtp(app.locals.email,otp)
                     
            if(status?.status){
                res.status(200).json({success:true,messega:status?.message})
            }else{ 
                res.status(401).json({message:"otp verification failed"})               
                
            }
        }catch(err){
            res.status(500).json({ message: 'Internal server error' });
            
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        
        const data:registerBody = {...req.body,email:app.locals.email}

        try {
            await this.userAuthUseCase.UserRegister(data)

            res.status(200).json({success:true,message:"successfylly created new account"})
            
        } catch (error) {
            console.log(error);        
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        const loginBody:loginBody=req.body

        try {
            const status = await this.userAuthUseCase.authenticateUser(loginBody)

            if(!status?.status){
                res.status(400).json({message:status?.message,})
                return;
            }

            res.status(200).json({success:true,message:status?.message,userData:status?.userData})
            
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
            
        }

    }
 
}

export default UserAuthController;
