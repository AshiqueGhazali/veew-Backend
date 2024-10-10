import { Request, Response } from "express";
import IAdminController from "../../interface/controler/IAdminController";
import IAdminUseCase from "../../interface/useCase/IAdminUseCase";


class AdminController implements IAdminController{
    private adminUsecase : IAdminUseCase

    constructor(adminUseCase:IAdminUseCase){
        this.adminUsecase=adminUseCase
    }

    async login(req: Request, res: Response): Promise<void> {
        try {            
            const {userName,password} = req.body
            const status = await this.adminUsecase.verifyLogin({userName,password})

            if(!status?.status){
                res.status(401).json({message:"user name and password is incorrect"})
                return
            }

            res.cookie("adminToken", status.token, { maxAge: 3600000 });     
            res.status(200).json({success:true,message:"login successfull"})
            
        } catch (error) {
            throw error
        }
    }

    async getToken(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.adminToken
            if(token){
                const response = await this.adminUsecase.verifyToken(token)
                res.status(200).json(response)
                return
            }
            res.status(401).json({status:false})
            
        } catch (error) {
            throw error
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.cookie("adminToken","",{httpOnly:true,expires:new Date()})
            res.status(200).json({ status: true,message:"logout completed" });
        } catch (error) {
            throw error
        }
    }

}

export default AdminController