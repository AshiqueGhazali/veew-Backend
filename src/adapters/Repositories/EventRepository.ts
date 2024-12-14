import { Model, ModelDefined, Sequelize, where } from "sequelize";
import IEventRepository, { createTicketParams } from "../../interface/repository/IEventRepository";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  createEventParams,
  dataCountResponse,
  editEventDateParams,
  editEventDetailsParams,
  IAddCommentParms,
  IReportUserParams,
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
import { IILiveStatusCreationAttributes, ILiveStatus } from "../../entity/liveStatus";
import { IILikesCreationAttributes, ILikes } from "../../entity/likesEntity";
import { IComments, ICommentsCreationAttributes } from "../../entity/commentsEntity";
import { IUserReport, IUserReportCreationAttributes } from "../../entity/userReportEntity";

export default class EventRepository implements IEventRepository {
  private EventModel: ModelDefined<IEvent, IEventCreationAttributes>;
  private UserModel: ModelDefined<IUser, IUserCreationAttributes>;
  private TicketModel:ModelDefined<ITicket,ITicketCreationAttributes>
  private WalletModal:ModelDefined<IWallet,IWalletCreationAttributes>
  private TransactionModel:ModelDefined<ITransaction,ITransactionCreationAttributes>
  private NotificationModel:ModelDefined<INotification,INotificationCreationAttributes>
  private LiveStatusModel:ModelDefined<ILiveStatus,IILiveStatusCreationAttributes>
  private LikesModel:ModelDefined<ILikes,IILikesCreationAttributes>
  private CommentsModel:ModelDefined<IComments,ICommentsCreationAttributes>
  private UserReportModel:ModelDefined<IUserReport,IUserReportCreationAttributes>

  constructor(
    EventModel: ModelDefined<IEvent, IEventCreationAttributes>,
    UserModel: ModelDefined<IUser, IUserCreationAttributes>,
    TicketModel:ModelDefined<ITicket,ITicketCreationAttributes>,
    WalletModal:ModelDefined<IWallet,IWalletCreationAttributes>,
    TransactionModel:ModelDefined<ITransaction,ITransactionCreationAttributes>,
    NotificationModel:ModelDefined<INotification,INotificationCreationAttributes>,
    LiveStatusModel:ModelDefined<ILiveStatus,IILiveStatusCreationAttributes>,
    LikesModel:ModelDefined<ILikes,IILikesCreationAttributes>,
    CommentsModel:ModelDefined<IComments,ICommentsCreationAttributes>,
    UserReportModel:ModelDefined<IUserReport,IUserReportCreationAttributes>
  ) {
    this.EventModel = EventModel;
    this.UserModel = UserModel;
    this.TicketModel = TicketModel;
    this.WalletModal = WalletModal
    this.TransactionModel = TransactionModel;
    this.NotificationModel = NotificationModel;
    this.LiveStatusModel = LiveStatusModel;
    this.LikesModel = LikesModel
    this.CommentsModel = CommentsModel;
    this.UserReportModel =UserReportModel
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
        order: [['createdAt', 'DESC']],
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
        order: [['createdAt', 'DESC']],
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

        if(event){
          return event
        }else{
          return null
          
        }
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

  async createNotification(userId: string,notificationHead:string, notification: string): Promise<Model<INotification, INotificationCreationAttributes>> {
    try {
      const newNotification = await this.NotificationModel.create({
        userId,
        notificationHead,
        notification
      })
      return newNotification
    } catch (error) {
      throw error
    }
  }

  async setEventStartTime(eventId: string, startTime: string): Promise<void> {
      try {
        const now = new Date();
        const endTime = new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString()

        const isLive = await this.LiveStatusModel.findOne({
          where: { eventId },
        });
        if (!isLive) {
          const started = await this.LiveStatusModel.create({
            eventId,
            startTime,
            endTime
          });          
        }
        return
      } catch (error) {
        throw error;
      }
  }

  async setEventEndTime(eventId: string, endTime: string, approvedAmount:number): Promise<void> {
      try {
        const isLive = await this.LiveStatusModel.update({endTime,approvedAmount},{where:{eventId}})
        console.log("updated",isLive);
        
        return
      } catch (error) {
        throw error
      }
  }

  async findUser(userId: string): Promise<Model<IUser, IUserCreationAttributes> | null> {
      try {
        const user = await this.UserModel.findOne({where:{id:userId}})

        return user
      } catch (error) {
        throw error
      }
  }

  async AddLike(eventId: string, userId: string): Promise<void> {
      try {
        let isLike = await this.LikesModel.findOne({
          where: {
            eventId,
            userId
          },
          paranoid: false
        });

        if(isLike){
           await this.LikesModel.restore({
            where: {
              eventId,
              userId
            },
          })
        }else {
          isLike = await this.LikesModel.create({eventId,userId})
        }

        const updateLikeCount = await this.EventModel.increment('likes',{
          by:1,
          where:{
            id:eventId
          }
        })
        return
      } catch (error) {
        throw error
      }
  }

  async removeLike(eventId: string, userId: string): Promise<void> {
      try {
        const isLike = await this.LikesModel.destroy({
          where:{
            eventId,userId
          }
        })

        const updateLikeCount = await this.EventModel.decrement('likes',{
          by:1,
          where:{
            id:eventId
          }
        })

        return
      } catch (error) {
        throw error
      }
  }

  async getLikedEventIds(userId: string): Promise<string[] | null> {
      try {
        const likes = await this.LikesModel.findAll({where:{
          userId
        }})

        if(!likes){
          return null
        }
        const eventIds = likes.map(like=>like.dataValues.eventId)        
        return eventIds
      } catch (error) {
        throw error
      }
  }

  async addComment(data: IAddCommentParms): Promise<void> {
      try {
        const comment = await this.CommentsModel.create(data)

        const updateLikeCount = await this.EventModel.increment('comments',{
          by:1,
          where:{
            id:data.eventId
          }
        })
        return
      } catch (error) {
        throw error
      }
  }

  async findEventComments(eventId: string): Promise<Model<IComments, ICommentsCreationAttributes>[] | null> {
      try {
        const comments = await this.CommentsModel.findAll({where:{
          eventId,
          parentId:null
        },include:[
          {
            model:this.UserModel,
            as:"CommentedBy",
            required:true
          },
          {
            model:this.EventModel,
            as:"CommentedEvent",
            required:true
          },
          {
            model: this.CommentsModel,
            as: "replies",
            include: [
              {
                model: this.UserModel,
                as: "CommentedBy",
                required: true,
              },
              {
                model: this.EventModel,
                as: "CommentedEvent",
                required: true,
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      })

        return comments
      } catch (error) {
        throw error
      }
  }

  async deleteComment(commentId: string): Promise<void> {
      try {
        const comment = await this.CommentsModel.findOne({where:{
          id:commentId
        }})
        if(!comment){
          return
        }
        comment.destroy()
        // const deleted = await this.CommentsModel.destroy({where:{id:commentId}})

        const updateLikeCount = await this.EventModel.decrement('comments',{
          by:1,
          where:{
            id:comment.dataValues.eventId
          }
        })
        return
      } catch (error) {
        throw error
      }
  }

  async findCommentById(commentId: string): Promise<Model<IComments, ICommentsCreationAttributes> | null> {
      try {
        const comment = await this.CommentsModel.findOne({where:{
          id:commentId
        }})

        return comment
      } catch (error) {
       throw error 
      }
  }

  async getAdminEventApprovals(): Promise<Model<ILiveStatus, IILiveStatusCreationAttributes>[] | null> {
      try {
        
        const events = await this.LiveStatusModel.findAll({
          // where:{isApproved:false},
          include:[
            {
              model:this.EventModel,
              as:'liveEvent',
              required:true
            }
          ]
        })
        
        return events
      } catch (error) {        
        throw error
      }
  }

  async getTotalTicketAmountForEvent(eventId: string): Promise<number> {
      try {
        const result = await this.TicketModel.sum('amount', {
          where: {
            eventId: eventId,
            isCancelled: false 
          }
        });
    
        return result || 0;
      } catch (error) {
        throw error
      }
  }

  async updateApprovalStatus(eventId:string): Promise<void> {
      try {
        await this.LiveStatusModel.update({isApproved:true},{where:{eventId}})
        return
      } catch (error) {
        throw error
      }
  }

  async reportUser(data: IReportUserParams): Promise<Model<IUserReport,IUserReportCreationAttributes> | null> {
      try {
        const newReport = await this.UserReportModel.create(data)
        console.log("report is :",newReport);
        

        return newReport
      } catch (error) {
        throw error
      }
  }

  async getReportedUsersWithReporters(): Promise<Model<IUser, IUserCreationAttributes>[] | null> {
      try {
        const reportedUsers = await this.UserModel.findAll({
          include: [
            {
              model: this.UserReportModel,
              as: "reportsReceived", 
              where: {}, 
              include: [
                {
                  model: this.UserModel,
                  as: "reporter", 
                  required: true, 
                },
              ],
              attributes: ["reason"], 
              required: true,
            },
          ],
          attributes: ["id", "firstName", "lastName","email","image"],
          
        });

        console.log("repoppppprrrrr",reportedUsers);
        
        return reportedUsers;
      } catch (error) {
        throw error
      }
  }

}
