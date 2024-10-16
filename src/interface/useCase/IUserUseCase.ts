import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";

export interface editProfileBody {
    id:string
    firstName:string,
    lastName:string,
    phone?:string,
    gender?:string,
    age?:number,
    image?:string
 }



export default interface IuserUseCase{
    getUserProfile(userId:string):Promise<Model<IUser,IUserCreationAttributes>|null>
    editUserProfile(data:editProfileBody):Promise<void>
    editImage(userId:string,image:string):Promise<void>
}