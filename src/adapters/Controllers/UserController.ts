import { NextFunction, Request, Response } from "express";
import IUserController, { IAuthRequest } from "../../interface/controler/IUserController";
import IuserUseCase from "../../interface/useCase/IUserUseCase";


class UserController implements IUserController{
    private userUseCase : IuserUseCase

    constructor(userUseCase:IuserUseCase){
        this.userUseCase = userUseCase
    }

    async getUserData(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {            
            let userId:string=req.userId as string  
            
            const data=await this.userUseCase.getUserProfile(userId)
            if(!data){
                res.json(401).json({message:"could't find user"})
                return 
            }        
            res.status(200).json({userData:data})

        } catch (error) {
            throw error
        }
    }
}

export default UserController