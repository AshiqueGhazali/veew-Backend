import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../entity/userEntity";
import IUserRepository, { editData } from "../interface/repository/IUserRepository";
import IuserUseCase, {editProfileBody } from "../interface/useCase/IUserUseCase";
import IJwtService from "../interface/utils/IJwtService";


class UserUseCase implements IuserUseCase {
    private userRepository : IUserRepository
    private jwtService : IJwtService

    constructor(userRepository:IUserRepository, jwtService:IJwtService){
        this.userRepository = userRepository
        this.jwtService = jwtService
    }

    async getUserProfile(userId: string): Promise<Model<IUser, IUserCreationAttributes> | null> {
        try { 
            return await this.userRepository.fetchProfileData(userId);
        } catch (error) {
            throw error
        }
    }

    async editUserProfile(data: editProfileBody): Promise<void> {
        try {
            console.log("idddd is :", data.id);
            
            const editData:editData = {
                firstName:data.firstName,
                lastName:data.lastName
            }
            if(data.phone)editData.phone=data.phone
            if(data.gender)editData.gender=data.gender
            if(data.age)editData.age=data.age
            if(data.image)editData.image=data.image

            const response = await this.userRepository.editProfile(data.id,editData)
            return            
        } catch (error) {
            
        }
    }

    async editImage(userId:string,image:string): Promise<void> {
        try {
            await this.userRepository.editImage(userId,image)
            return         
        } catch (error) {
            
        }
    }
}

export default UserUseCase