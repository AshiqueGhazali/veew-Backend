import { Model, ModelDefined } from "sequelize";
import IUserRepository from "../../interface/repository/IUserRepository";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";


class UserRepository implements IUserRepository {
    private UserModel : ModelDefined<IUser,IUserCreationAttributes>

    constructor(UserModel:ModelDefined<IUser,IUserCreationAttributes>){
        this.UserModel = UserModel
    }

    async fetchPrfileData(userId: string): Promise<Model<IUser, IUserCreationAttributes> | null> {
        try {
            const userData = await this.UserModel.findOne({where:{
                id:userId
            }})     
            
            return userData

        } catch (error) {
            throw error
        }
    }

}

export default UserRepository