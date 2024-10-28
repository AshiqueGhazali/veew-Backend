import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";
import { IUserSubscription, IUserSubscriptionCreationAttributes } from "../../entity/userSubscriptionEntity";

export interface editData {
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  age?: number;
  image?: string;
}

export default interface IUserRepository {
  fetchProfileData(userId: string): Promise<Model<IUser, IUserCreationAttributes> | null>;
  editProfile(userId: string, data: editData): Promise<void>;
  editImage(userId: string, image: string): Promise<void>;
  fetchAllPlans(): Promise<Model<IPricing, IPricingCreationAttributes>[] | null>;
  fetchPlanData(planId:string):Promise<Model<IPricing, IPricingCreationAttributes>| null>;
  isUserPlanInSamePayment(paymentIntentId:string):Promise<Model<IUserSubscription,IUserSubscriptionCreationAttributes> | null>
  isUserPlanExist(userId:string,planId:string): Promise<Model<IUserSubscription, IUserSubscriptionCreationAttributes> | null>
  addUserSubscription(userId:string,paymentIntentId:string,planData:any):Promise<void>;
  getUserSubscriptionPlan(userId:string):Promise<Model<IUserSubscription,IUserSubscriptionCreationAttributes> | null>
}
