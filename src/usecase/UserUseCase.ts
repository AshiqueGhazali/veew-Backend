import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../entity/userEntity";
import IUserRepository, {
  editData,
  transactionParams,
} from "../interface/repository/IUserRepository";
import IuserUseCase, {
  editProfileBody,
} from "../interface/useCase/IUserUseCase";
import IJwtService from "../interface/utils/IJwtService";
import { IPricing, IPricingCreationAttributes } from "../entity/pricingEntity";
import Razorpay from "razorpay";
import Cripto from "crypto";
import { resObj } from "../interface/useCase/IUserAuthUseCase";
import { IStripe, paymentType } from "../interface/utils/IStripService";
import { IUserSubscription, IUserSubscriptionCreationAttributes } from "../entity/userSubscriptionEntity";
import { IWallet, IWalletCreationAttributes } from "../entity/walletEntity";
import { ITransaction, ITransactionCreationAttributes, paymentMethod, transactionPurpose, transactionType } from "../entity/transactionEntity";

class UserUseCase implements IuserUseCase {
  private userRepository: IUserRepository;
  private jwtService: IJwtService;
  private stripePayment : IStripe

  constructor(userRepository: IUserRepository, jwtService: IJwtService, stripePayment : IStripe) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.stripePayment = stripePayment
  }

  async getUserProfile(
    userId: string
  ): Promise<Model<IUser, IUserCreationAttributes> | null> {
    try {
      return await this.userRepository.fetchProfileData(userId);
    } catch (error) {
      throw error;
    }
  }

  async editUserProfile(data: editProfileBody): Promise<void> {
    try {
      console.log("idddd is :", data.id);

      const editData: editData = {
        firstName: data.firstName,
        lastName: data.lastName,
      };
      if (data.phone) editData.phone = data.phone;
      if (data.gender) editData.gender = data.gender;
      if (data.age) editData.age = data.age;
      if (data.image) editData.image = data.image;

      const response = await this.userRepository.editProfile(data.id, editData);
      return;
    } catch (error) {}
  }

  async editImage(userId: string, image: string): Promise<void> {
    try {
      await this.userRepository.editImage(userId, image);
      return;
    } catch (error) {}
  }

  async getAllPricingPlans(): Promise<
    Model<IPricing, IPricingCreationAttributes>[] | null
  > {
    try {
      const plans = await this.userRepository.fetchAllPlans();
      return plans;
    } catch (error) {
      throw error;
    }
  }

  async createPayment(userId:string,planId: string): Promise<any> {
    try {
      
      const planData = await this.userRepository.fetchPlanData(planId)
      if(!planData){
        return null
      }
      const isUserHavePlan = await this.userRepository.isUserPlanExist(userId,planId)
      if(isUserHavePlan){
        return {
          status:false,
          message:"User Already have same plan!"
        }
      }
      const response = await this.stripePayment.makePayment(planData?.dataValues.price,planId,null,paymentType.SUBSCRIPTION)
      
      return {
        status:true,
        sessionId:response
      }

    } catch (error) {
      console.log(error);
      return null
      
    }
  }

  async conformPlanSubscription(userId: string, planId: string, sessionId: string): Promise<resObj | null> {
      try {        
        
        const planData = await this.userRepository.fetchPlanData(planId)

        if(!planData){
          return {
            status:false,
            message:"subscription plan not found"
          }
        }
        const paymentint = await this.stripePayment.getPaymentIntentFromSession(sessionId)        
        if(!paymentint){
          return {
            status:false,
            message:"Payment intent not found"
          }
        }
        const isPlan = await this.userRepository.isUserPlanInSamePayment(paymentint?.id)
        const isPlanExist = await this.userRepository.isUserPlanExist(userId,planId)        

        if(isPlan){
          return {
            status:false,
            message:"The plan is already subscribed with the same payment"
          } 
        }
        if(isPlanExist){
          return {
            status:false,
            message:"You have same plan!"
          } 
        }

        await this.userRepository.addUserSubscription(userId,paymentint.id,planData)
        const transactionData:transactionParams ={
          userId,
          transactionType:transactionType.DEBIT,
          paymentIntentId:paymentint.id,
          paymentMethod:paymentMethod.ONLINE,
          purpose: transactionPurpose.PRICING,
          amount:planData.dataValues.price
        }
        const transaction = await this.userRepository.createTransactions(transactionData)
        return {
          status:true,
          message:"plan subscribed successfully"
        }
      } catch (error) {
        console.log(error);
         return null
      }
  }

  async getUserSubscriptionPlan(userId: string): Promise<Model<IUserSubscription, IUserSubscriptionCreationAttributes> | null> {
      try {
        const userPlan = await this.userRepository.getUserSubscriptionPlan(userId);
      
        if (!userPlan) {
          return null; 
        }

        const currentDate = new Date();
        const expireDate = userPlan.getDataValue("expireDate");

        if (expireDate && expireDate < currentDate) {
          console.log("Subscription has expired");
          return null; 
        }

        return userPlan;
      } catch (error) {
        console.log(error);
         return null
      }
  }

  async addFundToWallet(userId: string, amount: number): Promise<any> {
      try {        
        const response = await this.stripePayment.makePayment(amount,null,null,paymentType.WALLET)
      
      return {
        status:true,
        sessionId:response
      }
      } catch (error) {
        console.log(error);
        return null
      }
  }

  async conformWalletCredit(userId: string, sessionId: string): Promise<resObj | null> {
      try {

        const paymentint = await this.stripePayment.getPaymentIntentFromSession(sessionId)        
        if(!paymentint){
          return {
            status:false,
            message:"Payment intent not found"
          }
        }

        const amount = paymentint.amount/100
        

        const wallet = await this.userRepository.addFundToWallet(userId,amount)
        if(wallet){
          const transactionData:transactionParams ={
            userId,
            transactionType:transactionType.CREDIT,
            paymentIntentId:paymentint.id,
            paymentMethod:paymentMethod.ONLINE,
            purpose: transactionPurpose.WALLET,
            amount:amount
          }

          const transaction = await this.userRepository.createTransactions(transactionData)

          if(transaction){
            return {
              status:true,
              message:`${amount} addedd to wallet!`
            }
          }
        }
        return {
          status:false,
          message:"not addedd to wallet"
        }
      } catch (error) {
        console.log(error);
        return null
      }
  }

  async getUserWallet(userId: string): Promise<Model<IWallet, IWalletCreationAttributes> | null> {
      try {
        return await this.userRepository.fetchUserWallet(userId)
      } catch (error) {
        throw error
      }
  }

  async getUserWalletTransactions(userId: string): Promise<Model<ITransaction, ITransactionCreationAttributes>[] | null> {
      try {
        return await this.userRepository.fetchUserWalletTransactions(userId)
      } catch (error) {
        throw error
      }
  }

  

}

export default UserUseCase;
