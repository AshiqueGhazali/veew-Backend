import IAdminRepository from "../interface/repository/IAdminRepository";
import IAdminUseCase, { adminresObj, adminVerifyTokenResponse, loginParams } from "../interface/useCase/IAdminUseCase";
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
            console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
            throw error            
        }
    }
}

export default AdminUseCase