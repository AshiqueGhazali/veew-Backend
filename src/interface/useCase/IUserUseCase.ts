import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";
import { resObj } from "./IUserAuthUseCase";

export interface editProfileBody {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  age?: number;
  image?: string;
}

export interface createPlanResponse {
  key: string,
  amount: number,
  orderId: string,
  currency: string,
}

export interface verifyPlanParams{
  planId:string,
  userId:string,
  orderCreationId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string,

}
export default interface IuserUseCase {
  getUserProfile(userId: string): Promise<Model<IUser, IUserCreationAttributes> | null>;
  editUserProfile(data: editProfileBody): Promise<void>;
  editImage(userId: string, image: string): Promise<void>;
  getAllPricingPlans(): Promise<Model<IPricing, IPricingCreationAttributes>[] | null>;
  createPayment(planId:string):Promise<createPlanResponse|null>
  verifyPayment(data:verifyPlanParams):Promise<resObj|null>
}
