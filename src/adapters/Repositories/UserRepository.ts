import { Model, ModelDefined, Sequelize, where } from "sequelize";
import IUserRepository, {
  editData,
  transactionParams,
} from "../../interface/repository/IUserRepository";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";
import { IUserSubscription, IUserSubscriptionCreationAttributes } from "../../entity/userSubscriptionEntity";
import { Op } from "sequelize";
import { IWallet, IWalletCreationAttributes } from "../../entity/walletEntity";
import { ITransaction, ITransactionCreationAttributes, paymentMethod, transactionPurpose, transactionType } from "../../entity/transactionEntity";

class UserRepository implements IUserRepository {
  private UserModel: ModelDefined<IUser, IUserCreationAttributes>;
  private PricingModel: ModelDefined<IPricing, IPricingCreationAttributes>;
  private UserSubscriptionModel: ModelDefined<IUserSubscription,IUserSubscriptionCreationAttributes>
  private WalletModal: ModelDefined<IWallet,IWalletCreationAttributes>;
  private TransactionModel:ModelDefined<ITransaction,ITransactionCreationAttributes>

  constructor(
    UserModel: ModelDefined<IUser, IUserCreationAttributes>,
    PricingModel: ModelDefined<IPricing, IPricingCreationAttributes>,
    UserSubscriptionModel: ModelDefined<IUserSubscription,IUserSubscriptionCreationAttributes>,
    WalletModal: ModelDefined<IWallet,IWalletCreationAttributes>,
    TransactionModel:ModelDefined<ITransaction,ITransactionCreationAttributes>,
  ) {
    this.UserModel = UserModel;
    this.PricingModel = PricingModel;
    this.UserSubscriptionModel = UserSubscriptionModel
    this.WalletModal = WalletModal;
    this.TransactionModel = TransactionModel;
  }

  async fetchProfileData(
    userId: string
  ): Promise<Model<IUser, IUserCreationAttributes> | null> {
    try {

      if (userId) {
        const userData = await this.UserModel.findOne({
          where: {
            id: userId,
          },
        });

        return userData;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async editProfile(userId: string, data: editData): Promise<void> {
    try {
      const profileUpdate = await this.UserModel.update(data, {
        where: {
          id: userId,
        },
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  async editImage(userId: string, image: string): Promise<void> {
    try {
      await this.UserModel.update(
        { image: image },
        {
          where: {
            id: userId,
          },
        }
      );
      return;
    } catch (error) {
      throw error;
    }
  }

  async fetchAllPlans(): Promise<
    Model<IPricing, IPricingCreationAttributes>[] | null
  > {
    try {
      const plans = await this.PricingModel.findAll();
      return plans;
    } catch (error) {
      throw error;
    }
  }

  async fetchPlanData(planId: string): Promise<Model<IPricing, IPricingCreationAttributes> | null> {
      try {
        const planData = await this.PricingModel.findOne({where:{
          id:planId
        }})

        if(!planData){
          return null
        }
        return planData
      } catch (error) {
        console.log(error);
        return null
      }
  }

  async isUserPlanInSamePayment(paymentIntentId: string): Promise<Model<IUserSubscription, IUserSubscriptionCreationAttributes> | null> {
      try {

        const plan = await this.UserSubscriptionModel.findOne({where:{
          paymentIntentId:paymentIntentId
        }})

        return plan
      } catch (error) {
        console.log(error);
        return null
      }
  }

  async isUserPlanExist(userId:string,planId:string): Promise<Model<IUserSubscription, IUserSubscriptionCreationAttributes> | null> {
    try {
      const currentDate = new Date()

      const plan = await this.UserSubscriptionModel.findOne({where:{
        userId:userId,
        planId:planId,
        [Op.or]: [
          {
              expireDate: {
                  [Op.gt]: currentDate 
              }
          },
          {
              numberOfEventsUsed: {
                  [Op.lt]: Sequelize.col('maxNumberOfEvents') 
              }
          }
      ]
      }})

      return plan
    } catch (error) {
      console.log(error);
      return null
    }
}

  async addUserSubscription(userId: string, paymentIntentId: string, planData: any): Promise<void> {
      try {

        console.log("ya here is how many times");
        
        const startDate = new Date();
        let expireDate = undefined
        if(planData.expireAfter){
          expireDate = new Date(startDate); 
          expireDate.setMonth(expireDate.getMonth() + planData.expireAfter);
        }
         

        const userPlan = await this.UserSubscriptionModel.create({
          userId:userId,
          planId:planData.id,
          paymentIntentId:paymentIntentId,
          startDate:startDate,
          expireDate:expireDate,
          numberOfEventsUsed:0,
          maxNumberOfEvents:planData.numberOfEvents,
        })

        return
      } catch (error) {
        console.log(error);
        return
      }
  }

  async getUserSubscriptionPlan(userId: string): Promise<Model<IUserSubscription, IUserSubscriptionCreationAttributes> | null> {
      try {
        const userPlan = await this.UserSubscriptionModel.findOne({
          where:{userId},
          include:[
            {
              model:this.PricingModel,
              as:"pricing",
              required:true
            }
          ]
        })

        console.log("user plan is :::",userPlan);
        
        return userPlan
      } catch (error) {
        console.log(error);
        return null
      }
  }

  async addFundToWallet(userId: string, amount: number): Promise<Model<IWallet, IWalletCreationAttributes> | null> {
      try {
        let wallet = await this.WalletModal.findOne({
          where:{userId:userId}
        })

        if(wallet){
          const balanceAmount = wallet.dataValues.balanceAmount + amount
          await this.WalletModal.update({
            balanceAmount:balanceAmount
          },{where:{
            userId:userId}})
        }else {
          wallet =await this.WalletModal.create({
            userId,balanceAmount:amount
          })
        }
        return wallet
      } catch (error) {
        throw error
      }
  }

  async createTransactions(data: transactionParams): Promise<Model<ITransaction, ITransactionCreationAttributes> | null> {
      try {
        const transaction = await this.TransactionModel.create({
          ...data
        })

        return transaction
      } catch (error) {
        throw error
      }
  }

  async fetchUserWallet(userId: string): Promise<Model<IWallet, IWalletCreationAttributes> | null> {
      try {
        let wallet = await this.WalletModal.findOne({where:{userId:userId}})

        if(!wallet){
          wallet = await this.WalletModal.create({
            userId:userId,
            balanceAmount:0
          })
        }

        return wallet
      } catch (error) {
        throw error
      }
  }

  async fetchUserWalletTransactions(userId: string): Promise<Model<ITransaction, ITransactionCreationAttributes>[] | null> {
      try {
        const transactions = await this.TransactionModel.findAll({where:{
          userId,
          [Op.or]:[
            {purpose:transactionPurpose.WALLET},
            {paymentMethod:paymentMethod.WALLET}
          ]
          
        }})

        return transactions
      } catch (error) {
        throw error
      }
  }
}

export default UserRepository;
