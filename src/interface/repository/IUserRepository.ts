import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";


export default interface IUserRepository {
    fetchPrfileData(userId:string):Promise<Model<IUser,IUserCreationAttributes>|null>
}