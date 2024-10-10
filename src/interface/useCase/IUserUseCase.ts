import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";


export default interface IuserUseCase{
    getUserProfile(userId:string):Promise<Model<IUser,IUserCreationAttributes>|null>
}