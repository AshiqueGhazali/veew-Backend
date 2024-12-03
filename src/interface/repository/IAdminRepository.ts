import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import { addPlanParams, IEventCountPerCategory, IEventCountPerDay, ILastMonthTransactions } from "../useCase/IAdminUseCase";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";
import { INotification, INotificationCreationAttributes } from "../../entity/notificationsEntity";


export default interface IAdminRepository {
  getAllUsers(): Promise<Model<IUser, IUserCreationAttributes>[] | null>;
  changeBlockStatus(userId: string): Promise<void>;
  addPricingPlan(data: addPlanParams): Promise<void>;
  getAllPlans(): Promise<Model<IPricing, IPricingCreationAttributes>[] | null>;
  updatePlan(planId: string, data: addPlanParams): Promise<void>;
  destroyPlan(planId:string):Promise<void>
  getAllSubscribers():Promise<any>
  getEventCountPerDay():Promise<IEventCountPerDay[]|null>
  getEventCountPerCategory():Promise<IEventCountPerCategory[] | null>
  getLetestUsers():Promise<Model<IUser | IUserCreationAttributes>[] | null>
  getLastMonthTransactions():Promise<ILastMonthTransactions>
  createNotification(userId:string,notificationHead:string, notification:string):Promise<Model<INotification,INotificationCreationAttributes>>

}
