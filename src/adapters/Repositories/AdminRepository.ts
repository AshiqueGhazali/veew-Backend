import { Model, ModelDefined } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import IAdminRepository from "../../interface/repository/IAdminRepository";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";
import { addPlanParams } from "../../interface/useCase/IAdminUseCase";
import { IUserSubscription, IUserSubscriptionCreationAttributes } from "../../entity/userSubscriptionEntity";

class AdminRepository implements IAdminRepository {
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

  async getAllUsers(): Promise<Model<IUser, IUserCreationAttributes>[] | null> {
    try {
      const usersData = await this.UserModel.findAll({});
      return usersData;
    } catch (error) {
      throw error;
    }
  }

  async changeBlockStatus(userId: string): Promise<void> {
    try {
      const user = await this.UserModel.findOne({ where: { id: userId } });
      if (user) {
        const typedUser = user as unknown as IUser;
        typedUser.isBlock = !typedUser?.isBlock;
        user.save();
        return;
      }

      return;
    } catch (error) {
      throw error;
    }
  }

  async addPricingPlan(data: addPlanParams): Promise<void> {
    try {
      const nwePlan = await this.PricingModel.create(data);

      return;
    } catch (error) {
      throw error;
    }
  }

  async getAllPlans(): Promise<
    Model<IPricing, IPricingCreationAttributes>[] | null
  > {
    try {
      const plans = await this.PricingModel.findAll();
      return plans;
    } catch (error) {
      throw error;
    }
  }

  async updatePlan(planId: string, data: addPlanParams): Promise<void> {
    try {
      const editedPlan = this.PricingModel.update(
        { ...data },
        {
          where: {
            id: planId,
          },
        }
      );
      return;
    } catch (error) {
      throw error;
    }
  }

  async destroyPlan(planId: string): Promise<void> {
      try {
        await this.PricingModel.destroy({where:{
          id:planId
        }})

        return
      } catch (error) {
        throw error;
      }
  }

  async getAllSubscribers(): Promise<any> {
      try {        
        const subscriber = await this.UserSubscriptionModel.findAll({
          include: [
            {
              model: this.UserModel,
              as: 'user',
              attributes: ['firstName' , 'lastName' , 'email']
            },
            {
              model: this.PricingModel,
              as: 'pricing',
              attributes: ['title' , 'category']
            }
          ],
          attributes: ['id', 'startDate', 'expireDate', 'numberOfEventsUsed', 'maxNumberOfEvents']
        })
        
        return subscriber
      } catch (error) {
        console.log(error);
        return
      }
  }
}

export default AdminRepository;
