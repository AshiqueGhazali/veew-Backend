import { Model, ModelDefined, Sequelize, where } from "sequelize";
import IEventRepository, { createTicketParams } from "../../interface/repository/IEventRepository";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  createEventParams,
  dataCountResponse,
  editEventDateParams,
  editEventDetailsParams,
  startEventRes,
} from "../../interface/useCase/IEventUseCase";
import { table } from "console";
import { ITicket, ITicketCreationAttributes } from "../../entity/ticketEntity";
import { transactionParams } from "../../interface/repository/IUserRepository";
import { ITransaction, ITransactionCreationAttributes } from "../../entity/transactionEntity";
import { IWallet, IWalletCreationAttributes } from "../../entity/walletEntity";
import UserSubscription from "../../framework/models/UserSubscriptionModel";
import { Op } from "sequelize";
import { INotification, INotificationCreationAttributes } from "../../entity/notificationsEntity";

export default class EventRepository implements IEventRepository {
  private EventModel: ModelDefined<IEvent, IEventCreationAttributes>;
  private UserModel: ModelDefined<IUser, IUserCreationAttributes>;
  private TicketModel:ModelDefined<ITicket,ITicketCreationAttributes>
  private WalletModal:ModelDefined<IWallet,IWalletCreationAttributes>
  private TransactionModel:ModelDefined<ITransaction,ITransactionCreationAttributes>
  private NotificationModel:ModelDefined<INotification,INotificationCreationAttributes>

  constructor(
    EventModel: ModelDefined<IEvent, IEventCreationAttributes>,
    UserModel: ModelDefined<IUser, IUserCreationAttributes>,
    TicketModel:ModelDefined<ITicket,ITicketCreationAttributes>,
    WalletModal:ModelDefined<IWallet,IWalletCreationAttributes>,
    TransactionModel:ModelDefined<ITransaction,ITransactionCreationAttributes>,
    NotificationModel:ModelDefined<INotification,INotificationCreationAttributes>

  ) {
    this.EventModel = EventModel;
    this.UserModel = UserModel;
    this.TicketModel = TicketModel;
    this.WalletModal = WalletModal
    this.TransactionModel = TransactionModel;
    this.NotificationModel = NotificationModel
  }

  async createEvent(
    userId: string,
    data: createEventParams
  ): Promise<Model<IEvent, IEventCreationAttributes> | null> {
    try {
      const newEvent = await this.EventModel.create({
        ...data,
        hostsId: userId,
      });

      console.log("userEvent is :", newEvent);

      return newEvent;
    } catch (error) {
      throw error;
    }
  }

  async getAllEvents(): Promise<
    Model<IEvent, IEventCreationAttributes>[] | null
  > {
    try {
      // const events = await this.EventModel.findAll()
      const events = await this.EventModel.findAll({
        include: [
          {
            model: this.UserModel,
            as: "user",
            required: true,
          },
        ],
      });

      return events;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUniqueCategories(): Promise<string[] | null> {
    try {
      const uniqueCategories = (await this.EventModel.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("category")), "category"],
        ],
        raw: true,
      })) as unknown as Array<{ category: string }>;

      if (!uniqueCategories) {
        return null;
      }

      return uniqueCategories.map((entry) => entry.category);
    } catch (error) {
      throw error;
    }
  }

  async fetchEventDetails(
    eventId: string
  ): Promise<Model<IEvent, IEventCreationAttributes> | null> {
    try {
      const event = await this.EventModel.findOne({
        where: {
          id: eventId,
        },
        include: [
          {
            model: this.UserModel,
            as: "user",
            required: true,
          },
        ],
      });
      return event;
    } catch (error) {
      throw error;
    }
  }

  async fetchUserEvents(
    userId: string
  ): Promise<Model<IEvent, IEventCreationAttributes>[] | null> {
    try {
      const userEvents = await this.EventModel.findAll({
        where: {
          hostsId: userId,
        },
      });
      return userEvents;
    } catch (error) {
      throw error;
    }
  }

  async editEventDetails(
    eventId: string,
    data: editEventDetailsParams
  ): Promise<void> {
    try {
      const event = await this.EventModel.update(
        { ...data },
        { where: { id: eventId } }
      );
      return;
    } catch (error) {
      throw error;
    }
  }

  async editEventDate(
    eventId: string,
    data: editEventDateParams
  ): Promise<void> {
    try {
      const event = await this.EventModel.update(
        { ...data },
        { where: { id: eventId } }
      );
      return;
    } catch (error) {
      throw error;
    }
  }

  async cancellEvent(eventId: string): Promise<void> {
    try {
      const cancelEvent = await this.EventModel.update(
        { isCancelled: true },
        { where: { id: eventId } }
      );

      return
    } catch (error) {
      throw error;
    }
  }

  async createTransactions(data: transactionParams): Promise<Model<ITransaction, ITransactionCreationAttributes> | null> {
    try {
      // const{ userId,transactionType,paymentIntentId,purpose,amount} = data
      const transaction = await this.TransactionModel.create({
        ...data
      })

      return transaction
    } catch (error) {
      throw error
    }
}


  async createTicket(data:createTicketParams): Promise<Model<ITicket, ITicketCreationAttributes> | null> {
      try {
        const ticket = await this.TicketModel.create({
          ...data
      })

      return ticket
      } catch (error) {
        throw error
      }
  }

  async getUserWallet(userId: string): Promise<Model<IWallet, IWalletCreationAttributes> | null> {
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

  async checkUserTicket(userId: string, eventId: string): Promise<Model<ITicket, ITicketCreationAttributes> | null> {
      try {
        const ticket = await this.TicketModel.findOne({where:{
          userId:userId,
          eventId:eventId
        }})

        return ticket
      } catch (error) {
        throw error
      }
  }

  async updateWalletAmount(userId: string,amount:number): Promise<void> {
      try {
        const wallet = await this.WalletModal.findOne({where:{
          userId
        }})
        if(wallet){
          const balance = wallet.dataValues.balanceAmount+amount
          await this.WalletModal.update({balanceAmount:balance},{where:{
            userId
          }})

        }
        return
      } catch (error) {
        throw error
      }
  }

  async getAllTicketForEvent(eventId: string): Promise<Model<ITicket, ITicketCreationAttributes>[] | null> {
      try {
        const tickets = await this.TicketModel.findAll({where:{
          eventId
        },include:[
          {
            model:this.UserModel,
            as:'ticketOwner',
            required:true
          }
        ]})

        return tickets
      } catch (error) {
        throw error
      }
  }

  async getAllTicketData(): Promise<Model<ITicket, ITicketCreationAttributes>[] | null> {
      try {
        const tickets = await this.TicketModel.findAll({
          include:[
            {
              model:this.UserModel,
              as:'ticketOwner',
              required:true
            }
          ]
        })
        
        return tickets
      } catch (error) {
        throw error
      }
  }

  async getAllUserTickets(userId: string): Promise<Model<ITicket, ITicketCreationAttributes>[] | null> {
      try {
        const tickets = await this.TicketModel.findAll(
          {where:{
            userId
          },
          include:[
            {
              model:this.UserModel,
              as:"ticketOwner",
              required:true
            },
            {
              model:this.EventModel,
              as:"eventDetails",
              required:true
            }
          ]
      })

      return tickets
      } catch (error) {
        throw error
      }
  }

  async userCancelTicket(ticketId: string): Promise<void> {
      try {
        const cancelled = await this.TicketModel.update(
          {isCancelled:true},
          {where:{id:ticketId}}
        )

        return
      } catch (error) {
        throw error
      }
  }

  async findTicketById(ticketId: string): Promise<Model<ITicket, ITicketCreationAttributes> | null> {
      try {
        const ticket = await this.TicketModel.findOne({where:
          {id:ticketId}
        })

        return ticket
      } catch (error) {
        throw error
      }
  }

  async saveMeetUrl(eventId: string, eventMeetUrl: string): Promise<void> {
      try {
        const currentDate = new Date()
        const event = await this.EventModel.update({
          eventMeetUrl:eventMeetUrl,
          eventMeetUrlUpdatedAt:currentDate
        },
        {where:
          {
            id:eventId
          }
        })

      } catch (error) {
        throw error
      }
  }

  async getEventByMeetLink(meetURL: string): Promise<Model<IEvent, IEventCreationAttributes> | null> {
      try {
        const event = await this.EventModel.findOne({where:{
          eventMeetUrl:meetURL
        }})

        return event
      } catch (error) {
        throw error
      }
  }

  async getDataCounts(): Promise<dataCountResponse | null> {
      try {
        const now = new Date();

        const totalUsers = await this.UserModel.count()
        const totalExpairedEvents = await this.EventModel.count({
          where: {
            [Op.or]: [
              {
                date: {
                  [Op.lt]: now,
                },
              },
              {
                [Op.and]: [
                  { date: { [Op.eq]: now.toISOString().split("T")[0] } },
                  {
                    endTime: {
                      [Op.lt]: now.toTimeString().split(" ")[0],
                    },
                  },
                ],
              },
            ],
          },
        });

        const totalUpcomingEvents = await this.EventModel.count({
          where: {
            [Op.or]: [
              {
                date: {
                  [Op.gt]: now,
                },
              },
              {
                [Op.and]: [
                  { date: { [Op.eq]: now.toISOString().split("T")[0] } },
                  {
                    endTime: {
                      [Op.gte]: now.toTimeString().split(" ")[0],
                    },
                  },
                ],
              },
            ],
          },
        });
        const totalSubscribers = await UserSubscription.count()
        const totalTickets = await this.TicketModel.count()

        return {
          totalUsers,
          totalExpairedEvents,
          totalUpcomingEvents,
          totalSubscribers,
          totalTickets
        }
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
