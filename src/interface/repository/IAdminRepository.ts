import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import { addPlanParams } from "../useCase/IAdminUseCase";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";

export default interface IAdminRepository {
  getAllUsers(): Promise<Model<IUser, IUserCreationAttributes>[] | null>;
  changeBlockStatus(userId: string): Promise<void>;
  addPricingPlan(data: addPlanParams): Promise<void>;
  getAllPlans(): Promise<Model<IPricing, IPricingCreationAttributes>[] | null>;
  updatePlan(planId: string, data: addPlanParams): Promise<void>;
}
