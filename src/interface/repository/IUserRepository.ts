import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";

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
}
