import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../entity/userEntity";
import IUserRepository from "../interface/repository/IUserRepository";
import IuserUseCase from "../interface/useCase/IUserUseCase";
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
            return await this.userRepository.fetchPrfileData(userId);
        } catch (error) {
            throw error
        }
    }
}

export default UserUseCase