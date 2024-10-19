import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import { IPricing, IPricingCreationAttributes } from "../../entity/pricingEntity";

export interface loginParams {
    userName:string;
    password:string
}
export  interface adminresObj{
    status:boolean,
    message:string,
    token?:string,
}

export interface adminVerifyTokenResponse{
    status:boolean,
    decoded?:object
}

export interface addPlanParams{
    title:string;
    category:"PRICING" | "SUBSCRIPTION";
    price:number;
    numberOfEvents:number;
    expireAfter?:number;
    maxParticipents:number;
    idealFor:string;
}

export default interface IAdminUseCase {
    verifyLogin({userName,password}:loginParams):Promise<adminresObj | null>
    verifyToken(token:string):Promise<adminVerifyTokenResponse>
    getUsersData():Promise<Model<IUser,IUserCreationAttributes>[] |null>
    blockUserAndUnblock(userId:string):Promise<void>;
    verifyPlan(data:addPlanParams):Promise<adminresObj|null>
    getPricingPlans():Promise<Model<IPricing,IPricingCreationAttributes>[] | null>
    editPricingPlan(planId:string,data:addPlanParams):Promise<adminresObj>
    softDeletePlan(planId:string):Promise<adminresObj | null>
}