import { Model, ModelDefined } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import IAdminRepository from "../../interface/repository/IAdminRepository";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";
import { addPlanParams } from "../../interface/useCase/IAdminUseCase";

class AdminRepository implements IAdminRepository {
  private UserModel: ModelDefined<IUser, IUserCreationAttributes>;
  private PricingModel: ModelDefined<IPricing, IPricingCreationAttributes>;

  constructor(
    UserModel: ModelDefined<IUser, IUserCreationAttributes>,
    PricingModel: ModelDefined<IPricing, IPricingCreationAttributes>
  ) {
    this.UserModel = UserModel;
    this.PricingModel = PricingModel;
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
      // const {title,category,price,expireAfter,maxParticipents,idealFor}=data
      console.log("ivde etthnna data is :", data);

      const nwePlan = await this.PricingModel.create(data);
      console.log("new plan is :", nwePlan);

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

      console.log("Updated is :", editedPlan);
      return;
    } catch (error) {
      throw error;
    }
  }
}

export default AdminRepository;
