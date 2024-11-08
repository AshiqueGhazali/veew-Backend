import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";
import { resObj } from "./IUserAuthUseCase";
import { IUserSubscription, IUserSubscriptionCreationAttributes } from "../../entity/userSubscriptionEntity";
import { IWallet, IWalletCreationAttributes } from "../../entity/walletEntity";
import { ITransaction, ITransactionCreationAttributes } from "../../entity/transactionEntity";

export interface editProfileBody {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  age?: number;
  image?: string;
}



export default interface IuserUseCase {
  getUserProfile(userId: string): Promise<Model<IUser, IUserCreationAttributes> | null>;
  editUserProfile(data: editProfileBody): Promise<void>;
  editImage(userId: string, image: string): Promise<void>;
  getAllPricingPlans(): Promise<Model<IPricing, IPricingCreationAttributes>[] | null>;
  createPayment(userId:string,planId:string):Promise<any>
  conformPlanSubscription(userId:string,planId:string,sessionId:string):Promise<resObj|null>;
  getUserSubscriptionPlan(userId:string):Promise<Model<IUserSubscription,IUserSubscriptionCreationAttributes> | null>
  addFundToWallet(userId:string , amount:number):Promise<any>
  conformWalletCredit(userId:string , sessionId:string):Promise<resObj|null>;
  getUserWallet(userId:string):Promise<Model<IWallet,IWalletCreationAttributes>|null>;
  getUserWalletTransactions(userId:string):Promise<Model<ITransaction,ITransactionCreationAttributes>[]|null>;
}
