import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import { addPlanParams } from "../useCase/IAdminUseCase";


export default interface IAdminRepository{
    getAllUsers():Promise<Model<IUser,IUserCreationAttributes>[] | null>
    changeBlockStatus(userId:string):Promise<void>
    addPricingPlan(data:addPlanParams):Promise<void>
}