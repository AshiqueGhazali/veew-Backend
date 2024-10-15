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

    async editUserProfile(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id,firstName, lastName,phone,gender,age,image}=req.body
            console.log(req.body);
            await this.userUseCase.editUserProfile({id,firstName, lastName,phone,gender,age,image})

            res.status(200).json({success:true,message:"profile updated"})

            return;
            
        } catch (error) {
            throw error
        }
    }

    async uploadProfileImg(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const imageUrl = req.file?.path; 
            if(req.userId && imageUrl){
                await this.userUseCase.editImage(req.userId,imageUrl)
                res.status(200).json({ imageUrl }); 
                return;
            }else{
                res.status(401).json({message:"user id is not getting"})
            }
        } catch (error) {
            
        }
    }
}

export default UserController