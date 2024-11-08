import { Model, ModelDefined } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";
import { IUserSubscription, IUserSubscriptionCreationAttributes } from "../../entity/userSubscriptionEntity";
import { ITransaction, ITransactionCreationAttributes, paymentMethod, transactionPurpose, transactionType } from "../../entity/transactionEntity";
import { IWallet, IWalletCreationAttributes } from "../../entity/walletEntity";

export interface editData {
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  age?: number;
  image?: string;
}

export interface transactionParams{
  userId:string,
  transactionType:transactionType;
  paymentIntentId:string;
  paymentMethod:paymentMethod
  purpose:transactionPurpose
  amount:number;
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
  addFundToWallet(userId:string , amount:number):Promise<Model<IWallet,IWalletCreationAttributes> | null>
  createTransactions(data:transactionParams):Promise<Model<ITransaction,ITransactionCreationAttributes>|null>
  fetchUserWallet(userId:string):Promise<Model<IWallet,IWalletCreationAttributes>|null>;
  fetchUserWalletTransactions(userId:string):Promise<Model<ITransaction,ITransactionCreationAttributes>[]|null>;
}
