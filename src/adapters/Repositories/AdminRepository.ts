import {  Model, ModelDefined } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import IAdminRepository from "../../interface/repository/IAdminRepository";


class AdminRepository implements IAdminRepository {
    private UserModel : ModelDefined<IUser,IUserCreationAttributes>

    constructor(UserModel:ModelDefined<IUser,IUserCreationAttributes>){
        this.UserModel = UserModel
    }

    async getAllUsers(): Promise<Model<IUser, IUserCreationAttributes>[] | null> {
        try {
            const usersData = await this.UserModel.findAll({})
            return usersData
        } catch (error) {
            throw error
        }
    }

    async changeBlockStatus(userId: string): Promise<void> {
        try {
            
            const user = await this.UserModel.findOne({where:{id:userId}})
            if(user){
                const typedUser = user as unknown as IUser;
                typedUser.isBlock = !typedUser?.isBlock
                user.save()
                return    
            }            

            return
        } catch (error) {
            throw error
        }
    }

}

export default AdminRepository