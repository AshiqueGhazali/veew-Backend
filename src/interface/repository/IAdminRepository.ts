import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";


export default interface IAdminRepository{
    getAllUsers():Promise<Model<IUser,IUserCreationAttributes>[] | null>
    changeBlockStatus(userId:string):Promise<void>
}