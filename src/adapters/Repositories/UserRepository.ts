import { Model, ModelDefined, Sequelize } from "sequelize";
import IUserRepository, {
  editData,
} from "../../interface/repository/IUserRepository";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";
import { IUserSubscription, IUserSubscriptionCreationAttributes } from "../../entity/userSubscriptionEntity";
import { Op } from "sequelize";

class UserRepository implements IUserRepository {
  private UserModel: ModelDefined<IUser, IUserCreationAttributes>;
  private PricingModel: ModelDefined<IPricing, IPricingCreationAttributes>;
  private UserSubscriptionModel: ModelDefined<IUserSubscription,IUserSubscriptionCreationAttributes>

  constructor(
    UserModel: ModelDefined<IUser, IUserCreationAttributes>,
    PricingModel: ModelDefined<IPricing, IPricingCreationAttributes>,
    UserSubscriptionModel: ModelDefined<IUserSubscription,IUserSubscriptionCreationAttributes>
  ) {
    this.UserModel = UserModel;
    this.PricingModel = PricingModel;
    this.UserSubscriptionModel = UserSubscriptionModel
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
}

export default UserRepository;
