import { Model, ModelDefined, Sequelize } from "sequelize";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import IAdminRepository from "../../interface/repository/IAdminRepository";
import { ChartDataPoint, IEventCountPerCategory, IEventCountPerDay, ILastMonthTransactions } from '../../interface/useCase/IAdminUseCase'
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";
import { addPlanParams } from "../../interface/useCase/IAdminUseCase";
import { IUserSubscription, IUserSubscriptionCreationAttributes } from "../../entity/userSubscriptionEntity";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";
import { ITicket, ITicketCreationAttributes } from "../../entity/ticketEntity";
import { Op } from "sequelize";
import { ITransaction, ITransactionCreationAttributes } from "../../entity/transactionEntity";
import sequelize from "sequelize";
import { INotification, INotificationCreationAttributes } from "../../entity/notificationsEntity";

class AdminRepository implements IAdminRepository {
  private UserModel: ModelDefined<IUser, IUserCreationAttributes>;
  private PricingModel: ModelDefined<IPricing, IPricingCreationAttributes>;
  private UserSubscriptionModel: ModelDefined<IUserSubscription,IUserSubscriptionCreationAttributes>
  private EventModel:ModelDefined<IEvent,IEventCreationAttributes>
  private TicketModel: ModelDefined<ITicket,ITicketCreationAttributes>;
  private TransactionModel:ModelDefined<ITransaction,ITransactionCreationAttributes>
  private NotificationModel:ModelDefined<INotification,INotificationCreationAttributes>

  constructor(
    UserModel: ModelDefined<IUser, IUserCreationAttributes>,
    PricingModel: ModelDefined<IPricing, IPricingCreationAttributes>,
    UserSubscriptionModel: ModelDefined<IUserSubscription,IUserSubscriptionCreationAttributes>,
    EventModel:ModelDefined<IEvent,IEventCreationAttributes>,
    TicketModel: ModelDefined<ITicket,ITicketCreationAttributes>,
    TransactionModel:ModelDefined<ITransaction,ITransactionCreationAttributes>,
    NotificationModel:ModelDefined<INotification,INotificationCreationAttributes>
  ) {
    this.UserModel = UserModel;
    this.PricingModel = PricingModel;
    this.UserSubscriptionModel = UserSubscriptionModel;
    this.EventModel = EventModel;
    this.TicketModel = TicketModel;
    this.TransactionModel = TransactionModel;
    this.NotificationModel = NotificationModel
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

  async getEventCountPerDay(): Promise<IEventCountPerDay[] | null> {
      try {
        const now = new Date();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(now.getDate() - 10);

        const eventCounts = await this.EventModel.findAll({
            attributes: [
                [Sequelize.fn("DATE", Sequelize.col("date")), "eventDate"],
                [Sequelize.fn("COUNT", Sequelize.col("id")), "eventCount"]
            ],
            where: {
                date: {
                    [Op.between]: [tenDaysAgo.toISOString().split('T')[0], now.toISOString().split('T')[0]]
                }
            },
            group: [Sequelize.fn("DATE", Sequelize.col("date"))],
            order: [[Sequelize.fn("DATE", Sequelize.col("date")), "ASC"]]
        });

        return eventCounts.map((entry) => ({
            date: entry.get("eventDate") as string, 
            count: Number(entry.get("eventCount")), 
        }));
      } catch (error) {
        throw error
      }
  }

  async getEventCountPerCategory(): Promise<IEventCountPerCategory[] | null> {
      try {
        const eventCounts = await this.EventModel.findAll({
          attributes: [
              "category", // Select the category field
              [Sequelize.fn("COUNT", Sequelize.col("id")), "eventCount"], // Count events per category
          ],
          group: ["category"], // Group by category
          order: [[Sequelize.col("category"), "ASC"]], // Optional: sort by category alphabetically
      });

      return eventCounts.map((entry) => ({
          category: entry.get("category") as string, // Cast to string
          count: Number(entry.get("eventCount")), // Ensure it's a number
      }));
      } catch (error) {
        throw error
      }
  }

  async getLetestUsers(): Promise<Model<IUser | IUserCreationAttributes>[] | null> {
      try {
        const latestUsers = await this.UserModel.findAll({
          order: [["createdAt", "DESC"]], 
          limit: 10,                     
        });
    
        return latestUsers;
      } catch (error) {
        throw error
      }
  }

  async getLastMonthTransactions(): Promise<ILastMonthTransactions> {
      try {        
        const currentDate = new Date();
        const firstDayOfLastMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
        const lastDayOfLastMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );

        const transactions = await this.TransactionModel.findAll({
          attributes: [
            "transactionType",
            [sequelize.fn("SUM", sequelize.col("amount")), "amount"], // Aggregate amount
            [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
          ],
          where: {
            createdAt: {
              [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth],
            },
          },
          group: [
            "transactionType",
            sequelize.fn("DATE", sequelize.col("createdAt")),
          ],
          raw: true,
        });

        const debitData: ChartDataPoint[] = [];
        const creditData: ChartDataPoint[] = [];

        transactions.forEach((transaction: any) => {
          const { date, transactionType, amount } = transaction;
          const dataPoint: ChartDataPoint = { date: date, amount: amount };

          if (transactionType === "DEBIT") {
            debitData.push(dataPoint);
          } else if (transactionType === "CREDIT") {
            creditData.push(dataPoint);
          }
        });     
        
        
        return { debitData, creditData };
      } catch (error) {        
        throw error
      }
  }

  async createNotification(userId: string, notification: string): Promise<Model<INotification, INotificationCreationAttributes>> {
    try {
      const newNotification = await this.NotificationModel.create({
        userId,
        notification
      })
      return newNotification
    } catch (error) {
      throw error
    }
  }
  
}

export default AdminRepository;
