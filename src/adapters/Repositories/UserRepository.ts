import { Model, ModelDefined } from "sequelize";
import IUserRepository, {
  editData,
} from "../../interface/repository/IUserRepository";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";

class UserRepository implements IUserRepository {
  private UserModel: ModelDefined<IUser, IUserCreationAttributes>;
  private PricingModel: ModelDefined<IPricing, IPricingCreationAttributes>;

  constructor(
    UserModel: ModelDefined<IUser, IUserCreationAttributes>,
    PricingModel: ModelDefined<IPricing, IPricingCreationAttributes>
  ) {
    this.UserModel = UserModel;
    this.PricingModel = PricingModel;
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
        console.log("no user fountttdddd");

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
      console.log("us eggegeggegge");

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
}

export default UserRepository;
