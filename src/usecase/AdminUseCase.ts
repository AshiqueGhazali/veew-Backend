import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../entity/userEntity";
import IAdminRepository from "../interface/repository/IAdminRepository";
import IAdminUseCase, { addPlanParams, adminresObj, adminVerifyTokenResponse, loginParams } from "../interface/useCase/IAdminUseCase";
import IJwtService from "../interface/utils/IJwtService";


class AdminUseCase implements IAdminUseCase {
    private adminRepository : IAdminRepository
    private jwtService : IJwtService

    constructor(adminRepository : IAdminRepository, jwtService : IJwtService){
        this.adminRepository = adminRepository
        this.jwtService = jwtService
    }

    async verifyLogin({ userName, password }: loginParams): Promise<adminresObj> {
        try {            
            if(userName===process.env.ADMIN_USER_NAME && password === process.env.ADMIN_PASSWORD){
                let token =await this.jwtService.createToken({ id: userName, role: "admin" });                
                return {
                    status:true,
                    message:"login succussfull",
                    token
                }
            }
            
            return {
                status:false,
                message:"User Name or Password is incorrect"
            }
        } catch (error) {
            throw error
        }
    }


    async verifyToken(token: string): Promise<adminVerifyTokenResponse> {
        try {
            let response = await this.jwtService.verify(token)

                if (response?.role === "admin") {
                    return {
                    status: true,
                    decoded: response,
                    };
                }

                return {
                    status: false,
                };
        } catch (error) {
            throw error            
        }
    }


    async getUsersData(): Promise<Model<IUser, IUserCreationAttributes>[] | null> {
        try {
            return await this.adminRepository.getAllUsers()
        } catch (error) {
            throw error
        }
    }

    async blockUserAndUnblock(userId: string): Promise<void> {
        try {
            await this.adminRepository.changeBlockStatus(userId)
            return
        } catch (error) {
            throw error
        }
    }

    async verifyPlan(data: addPlanParams): Promise<adminresObj | null> {
        try {
            if(!data || !['PRICING' , 'SUBSCRIPTION'].includes(data.category)){                
                return {
                    status:false,
                    message:"Invalid Data"
                }
            }

            const {title, category, price, numberOfEvents,maxParticipents,idealFor} = data
            const pricingData:addPlanParams = {title, category, price, numberOfEvents,maxParticipents,idealFor}

            if(data.expireAfter)pricingData.expireAfter=data.expireAfter

            await this.adminRepository.addPricingPlan(pricingData)
            return{
                status:true,
                message:`Add new ${data.category} plan`
            }
            return null
        } catch (error) {
            throw error
        }
    }
}

export default AdminUseCase