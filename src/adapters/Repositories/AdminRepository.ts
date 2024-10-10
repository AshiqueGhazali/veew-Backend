import {  ModelDefined } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import IAdminRepository from "../../interface/repository/IAdminRepository";


class AdminRepository implements IAdminRepository {
    private UserModel : ModelDefined<IUser,IUserCreationAttributes>

    constructor(UserModel:ModelDefined<IUser,IUserCreationAttributes>){
        this.UserModel = UserModel
    }

}

export default AdminRepository