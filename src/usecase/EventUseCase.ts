import { Model } from "sequelize";
import { IEvent, IEventCreationAttributes } from "../entity/eventEntity";
import IEventRepository, {
  createTicketParams,
} from "../interface/repository/IEventRepository";
import IEventUseCase, {
  createEventParams,
  dataCountResponse,
  editEventDateParams,
  editEventDetailsParams,
  IAddCommentParms,
  IReportEventParams,
  IReportUserParams,
  startEventRes,
} from "../interface/useCase/IEventUseCase";
import { resObj } from "../interface/useCase/IUserAuthUseCase";
import { IStripe, paymentType } from "../interface/utils/IStripService";
import IUserRepository, {
  transactionParams,
} from "../interface/repository/IUserRepository";
import {
  paymentMethod,
  transactionPurpose,
  transactionType,
} from "../entity/transactionEntity";
import { ITicket, ITicketCreationAttributes } from "../entity/ticketEntity";
import UserRepository from "../adapters/Repositories/UserRepository";
import { IComments, ICommentsCreationAttributes } from "../entity/commentsEntity";
import { ILiveStatus, IILiveStatusCreationAttributes } from "../entity/liveStatus";
import { IUser, IUserCreationAttributes } from "../entity/userEntity";

export default class EventUseCase implements IEventUseCase {
  private eventRepository: IEventRepository;
  private stripePayment: IStripe;

  constructor(eventRepository: IEventRepository, stripePayment: IStripe) {
    this.eventRepository = eventRepository;
    this.stripePayment = stripePayment;
  }

  async verifyEventCreation(
    userId: string,
    data: createEventParams
  ): Promise<resObj | null> {
    try {
      const response = await this.eventRepository.createEvent(userId, data);      

      if (!response) {
        return {
          status: false,
          message: "somthing went wrong!",
        };
      }

      const message = `Your event ${response.dataValues.eventTitle} has been successfully created. Start promoting it now!`
      await this.eventRepository.createNotification(response.dataValues.hostsId ,'Event Created Successfully! ' , message)

      return {
        status: true,
        message: "new event added!",
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllEvents(): Promise<
    Model<IEvent, IEventCreationAttributes>[] | null
  > {
    try {
      return await this.eventRepository.getAllEvents();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAllCategories(): Promise<string[] | null> {
    try {
      return await this.eventRepository.getUniqueCategories();
    } catch (error) {
      throw error;
    }
  }

  async verityEvent(
    eventId: string
  ): Promise<Model<IEvent, IEventCreationAttributes> | null> {
    try {
      return await this.eventRepository.fetchEventDetails(eventId);
    } catch (error) {
      throw error;
    }
  }

  async verifyUserEvents(
    userId: string
  ): Promise<Model<IEvent, IEventCreationAttributes>[] | null> {
    try {
      return this.eventRepository.fetchUserEvents(userId);
    } catch (error) {
      throw error;
    }
  }

  async verifyEditEventDetails(
    eventId: string,
    data: editEventDetailsParams
  ): Promise<resObj | null> {
    try {
      await this.eventRepository.editEventDetails(eventId, data);
      return {
        status: true,
        message: "succefully edited",
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEditEventDate(
    eventId: string,
    data: editEventDateParams
  ): Promise<resObj | null> {
    try {
      await this.eventRepository.editEventDate(eventId, data);
      return {
        status: true,
        message: "succefully edited",
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEventCancellation(eventId: string): Promise<resObj | null> {
    try {
      const event = await this.eventRepository.fetchEventDetails(eventId);

      if (!event) {
        return {
          status: false,
          message: "Event Not Found",
        };
      } else {
        const currentDate = new Date();
        const eventDate = new Date(event.dataValues.date);
        const eventDateOnly = eventDate.toDateString();
        const currentDateOnly = currentDate.toDateString();

        if (eventDate < currentDate && eventDateOnly !== currentDateOnly) {
          return {
            status: false,
            message: "Can't Cancel past events!",
          };
        }

        const startDateTime = new Date(
          `${eventDate}T${event.dataValues.startTime}`
        );
        const endDateTime = new Date(
          `${eventDate}T${event.dataValues.endTime}`
        );

        if (eventDateOnly === currentDateOnly) {
          const currentTime =
            currentDate.getHours() * 60 + currentDate.getMinutes();
          const startMinutes =
            startDateTime.getHours() * 60 + startDateTime.getMinutes();
          const endMinutes =
            endDateTime.getHours() * 60 + endDateTime.getMinutes();

          if (startMinutes < currentTime || endMinutes < currentTime) {
            return {
              status: false,
              message: "The Event Time is finished",
            };
          }
        }
      }

      await this.eventRepository.cancellEvent(eventId);
      const eventTickets = await this.eventRepository.getAllTicketForEvent(eventId)

      
      const transactionData = {
        transactionType: transactionType.CREDIT,
        paymentMethod: paymentMethod.WALLET,
        purpose: transactionPurpose.TICKET,
        amount: event?.dataValues.ticketPrice,
      };

      const refundNotification = `Refund Processed: Due to the cancellation of the event ${event.dataValues.eventTitle}, your ticket purchase of ${event.dataValues.ticketPrice} has been refunded. We apologize for the inconvenience.`
      eventTickets?.filter((ticket)=>{
        return (
          !ticket.dataValues.isCancelled
        )
      }).map((ticket)=>{
        return (
          this.eventRepository.updateWalletAmount(ticket.dataValues.userId , ticket.dataValues.amount),
          this.eventRepository.createTransactions({...transactionData,userId:ticket.dataValues.userId}),
          this.eventRepository.createNotification(ticket.dataValues.userId, 'Refund Processed:',refundNotification)
        )
      })

      const message = `The event ${event.dataValues.eventTitle} has been successfully canceled.`
      await this.eventRepository.createNotification(event.dataValues.hostsId, 'Event Canceled:',message)

      return {
        status: true,
        message: "Event Cancelled",
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyTicketBooking(userId: string, eventId: string): Promise<any> {
    try {
      const event = await this.eventRepository.fetchEventDetails(eventId);
      if (!event) {
        return {
          status: false,
          message: "event not found!",
        };
      }

      if (event.dataValues.hostsId === userId) {
        return {
          status: false,
          message: "This event hosts by you!",
        };
      }

      const isTicket = await this.eventRepository.checkUserTicket(userId,eventId)

      if(isTicket){
        return {
          status: false,
          message: "You already have this ticket!",
        };
      }

      const getAllTickets = await this.eventRepository.getAllTicketForEvent(eventId)
      if(getAllTickets && getAllTickets?.length > event.dataValues.participantCount){
        console.log("the ticketttt is ",getAllTickets?.length)
        console.log("the parrrrrrrr is ",event.dataValues.participantCount)
        return {
          status:false,
          message:"Tickets sold out"
        }
      }


      const amount = event.dataValues.ticketPrice;

      const response = await this.stripePayment.makePayment(
        amount,
        null,
        eventId,
        paymentType.TICKETBOOKING
      );

      return {
        status: true,
        sessionId: response,
      };
    } catch (error) {
      throw error;
    }
  }

  generateTicketCode(length = 7) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ticketCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        ticketCode += characters[randomIndex];
    }
    return ticketCode;
}
  async conformTicketBooket(
    userId: string,
    eventId: string,
    sessionId: string
  ): Promise<resObj | null> {
    try {
      const event = await this.eventRepository.fetchEventDetails(eventId);
      if (!event || event.dataValues.isCancelled) {
        return {
          status: false,
          message: "event not found!",
        };
      }

      const paymentint = await this.stripePayment.getPaymentIntentFromSession(
        sessionId
      );
      if (!paymentint) {
        return {
          status: false,
          message: "Payment intent not found",
        };
      }

      const ticketCode = this.generateTicketCode()
      const ticketData: createTicketParams = {
        ticketCode,
        userId,
        eventId,
        amount: event.dataValues.ticketPrice,
      };
      const createTicket = await this.eventRepository.createTicket(ticketData);

      if (createTicket) {
        const transactionData: transactionParams = {
          userId,
          transactionType: transactionType.DEBIT,
          paymentIntentId: paymentint.id,
          paymentMethod: paymentMethod.ONLINE,
          purpose: transactionPurpose.TICKET,
          amount: createTicket?.dataValues.amount,
        };

        const transaction = await this.eventRepository.createTransactions(
          transactionData
        );

        if(transaction){
          const message= `Your ticket for ${event.dataValues.eventTitle} has been successfully booked. Enjoy the event!`
          await this.eventRepository.createNotification(userId, 'Ticket Booking Confirmed:' ,message)
        }

        return {
          status: true,
          message: "Ticket Booked!",
        };
      }
      return {
        status: true,
        message: "heyyyy",
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyTicketBookingWithWallet(
    userId: string,
    eventId: string
  ): Promise<resObj | null> {
    try {
      const wallet = await this.eventRepository.getUserWallet(userId);
      const event = await this.eventRepository.fetchEventDetails(eventId);
      if (!event || event.dataValues.isCancelled) {
        return {
          status: false,
          message: "event not found!",
        };
      }

      if (event.dataValues.hostsId === userId) {
        return {
          status: false,
          message: "This event hosts by you!",
        };
      }

      const isTicket = await this.eventRepository.checkUserTicket(userId,eventId)

      if(isTicket){
        return {
          status: false,
          message: "You already have this ticket!",
        };
      }

      if (!wallet || wallet.dataValues.balanceAmount < event.dataValues.ticketPrice) {
        return {
          status: false,
          message: "No enugh balance in wallet!",
        };
      }

      const getAllTickets = await this.eventRepository.getAllTicketForEvent(eventId)
      
      if(getAllTickets && getAllTickets?.length > event.dataValues.participantCount){
        console.log("the ticketttt is ",getAllTickets?.length)
        console.log("the parrrrrrrr is ",event.dataValues.participantCount)


        return {
          status:false,
          message:"Tickets sold out"
        }
      }


      const ticketCode = this.generateTicketCode()
      const ticketData: createTicketParams = {
        ticketCode,
        userId,
        eventId,
        amount: event.dataValues.ticketPrice,
      };
      const createTicket = await this.eventRepository.createTicket(ticketData);

      if(createTicket){
        await this.eventRepository.updateWalletAmount(userId,-Math.abs(createTicket.dataValues.amount))
        const transactionData: transactionParams = {
          userId,
          transactionType: transactionType.DEBIT,
          paymentMethod: paymentMethod.WALLET,
          purpose: transactionPurpose.TICKET,
          amount: createTicket?.dataValues.amount,
        };

        const transaction = await this.eventRepository.createTransactions(
          transactionData
        );

        if(transaction){
          const message= `Your ticket for ${event.dataValues.eventTitle} has been successfully booked. Enjoy the event!`
          const nofificationHead = 'Ticket Booking Confirmed: '
          await this.eventRepository.createNotification(userId, nofificationHead, message)
        }
        return {
          status:true,
          message:"Ticket Conformed!"
        }
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async getAllTicketsData(): Promise<Model<ITicket, ITicketCreationAttributes>[] | null> {
      try {
        return await this.eventRepository.getAllTicketData()
      } catch (error) {
        throw error
      }
  }

  async getAllUserTickets(userId: string): Promise<Model<ITicket, ITicketCreationAttributes>[] | null> {
      try {
        return await this.eventRepository.getAllUserTickets(userId)
      } catch (error) {
        throw error
      }
  }

  async userCancelTicket(userId: string, ticketId: string): Promise<resObj | null> {
      try {
        const ticket = await this.eventRepository.findTicketById(ticketId)
        if(!ticket){
          return {
            status:false,
            message:"Ticket Not found"
          }
        }
        const event = await this.eventRepository.fetchEventDetails(ticket.dataValues.eventId)

        if(event){
          const currentDate = new Date()
          const eventDate = new Date(event.dataValues.date)

          if(currentDate >= eventDate){
            return {
              status:false,
              message:"cansellation time over"
            }
          }

          if(event?.dataValues.isCancelled){
            return {
              status:false,
              message:"Refunded by event cancellation!"
            }
          }
        }else{
          return {
            status:false,
            message: "Event Not Found!"
          }
        }
        await this.eventRepository.userCancelTicket(ticketId)
        await this.eventRepository.updateWalletAmount(userId, ticket.dataValues.amount)
        const transactionData: transactionParams = {
          userId,
          transactionType: transactionType.CREDIT,
          paymentMethod: paymentMethod.WALLET,
          purpose: transactionPurpose.TICKET,
          amount: ticket?.dataValues.amount,
        };
        const transaction = await this.eventRepository.createTransactions(transactionData)

        if(transaction){
          return {
            status:true,
            message:"Ticket Canselled Successfully!"
          }
        }

        return null
      } catch (error) {
        throw error
      }
  }

  async getAllTicketForEvent(eventId: string): Promise<Model<ITicket, ITicketCreationAttributes>[] | null> {
      try {
        return await this.eventRepository.getAllTicketForEvent(eventId)
      } catch (error) {
        throw error
      }
  }

  async verifyStartEvent(userId: string, eventId: string): Promise<startEventRes | null> {
      try {

        const event = await this.eventRepository.fetchEventDetails(eventId)

        const generateURL =()=> {
          let result = '';
          const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
          const len = 7;
          for (let i = 0; i < len; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return result;
        }

        if(event?.dataValues.hostsId !== userId){
          return {
            status:false,
            message:"Only hosts can start event"
          }
        }
        if(event.dataValues.eventMeetUrl){
          return {
            status:true,
            message:"contine",
            eventMeetUrl:event.dataValues.eventMeetUrl
          }
        }else{
          const currentDate = new Date()
          const eventDate = new Date(event.dataValues.date)
          const startDateTime = new Date(
            `${eventDate.toISOString().split('T')[0]}T${event.dataValues.startTime}`
          );
          const endDateTime = new Date(
            `${eventDate.toISOString().split('T')[0]}T${event.dataValues.endTime}`
          );

          if(currentDate.getDate()!==eventDate.getDate()){
            let message = ''
            if(currentDate.getDate()<eventDate.getDate()){
              message = 'Event date is in future!'
            }else{
              message = 'Event Time Expired'
            }

            return {
              status:false,
              message:message
            }
          }
  
          // if (eventDateOnly === currentDateOnly) {
            const currentTime =
              currentDate.getHours() * 60 + currentDate.getMinutes();
            const startMinutes =
              startDateTime.getHours() * 60 + startDateTime.getMinutes();
            const endMinutes =
              endDateTime.getHours() * 60 + endDateTime.getMinutes();
  
          if(currentTime >= startMinutes && currentTime <= endMinutes){
            const eventMeetUrl = generateURL()
            await this.eventRepository.saveMeetUrl(eventId,eventMeetUrl)

            const eventTickets = await this.eventRepository.getAllTicketForEvent(eventId)
            const eventStartNotificationHead = `Reminder`
            const eventStartNotification = `Reminder: The event ${event.dataValues.eventTitle} is now live! Join us and make the most of it.`
            eventTickets?.filter((ticket)=>{
              return (
                !ticket.dataValues.isCancelled
              )
            }).map((ticket)=>{
              return (
                this.eventRepository.createNotification(ticket.dataValues.userId, eventStartNotificationHead ,eventStartNotification)
              )
            })

            return {
              status:true,
              message:"event started",
              eventMeetUrl
            }

          }else{
            let timeMessage = ''
            currentTime < startMinutes ? timeMessage='scheduled time over!' : timeMessage='Start event only at the scheduled time.'
            return {
              status:false,
              message:timeMessage
            }
          }
        }
      } catch (error) {
        throw error
      }
  }

  async verifyEventJoining(meetUrl: string, userId: string): Promise<resObj | null> {
      try {

        console.log("hi amm hereee");
        
        const event = await this.eventRepository.getEventByMeetLink(meetUrl)
        if(!event){
          return {
            status:false,
            message:"Meet Not Found!"
          }
        }

        if(event.dataValues.hostsId === userId){
          return {
            status:false,
            message:"You are the creator!"
          }
        }

        if(event.dataValues.ticketPrice > 0){
          const isTicke = await this.eventRepository.checkUserTicket(userId,event.dataValues.id)
          console.log("is tickettttt");
          

          if(isTicke){            
            return {
              status:true,
              message:"ticket verified!"
            }
          }else{            
            return {
              status: false,
              message:"please conform your ticket!"
            }
          }
        }else{
          return {
            status:true,
            message:"You are joining..."
          }
        }
      } catch (error) {
        console.log("looooooooogggggg",error);
        throw error
      }
  }

  async getDataCounts(): Promise<dataCountResponse | null> {
      try {
        return await this.eventRepository.getDataCounts()
      } catch (error) {
        throw error
      }
  }

  async setStartTime(eventId: string, startTime: string): Promise<void> {
      try {
        await this.eventRepository.setEventStartTime(eventId,startTime)
      } catch (error) {
        throw error
      }
  }

  async updateEndTime(eventId: string, endTime: string): Promise<void> {
    try {
       const tickeAmount = await this.eventRepository.getTotalTicketAmountForEvent(eventId)
       console.log("ticketAmountIs",tickeAmount);
       
        await this.eventRepository.setEventEndTime(eventId,endTime,tickeAmount)
    } catch (error) {
      throw error
    }
  }

  async addLike(eventId: string, userId: string): Promise<resObj | null> {
      try {

        const user = await this.eventRepository.findUser(userId)
        const event = await this.eventRepository.fetchEventDetails(eventId)
        if(!user || !event){
          return {
            status:false,
            message:"user not found"
          }
        }
        await this.eventRepository.AddLike(eventId,userId)

        const notificationHead = `${user.dataValues.firstName} ${user.dataValues.lastName} liked your post`
        const message = `${user.dataValues.firstName} ${user.dataValues.lastName} liked your post: ${event.dataValues.eventTitle}`
        const notification = await this.eventRepository.createNotification(event.dataValues.hostsId, notificationHead,message)

        console.log(notification);

        return {
          status:true,
          message:"Liked for event"
        }
      } catch (error) {
        console.log(error);
        
        throw error
      }
  }

  async removeLike(eventId: string, userId: string): Promise<resObj | null> {
      try {
        const user = await this.eventRepository.findUser(userId)
        const event = await this.eventRepository.fetchEventDetails(eventId)
        if(!user || !event){
          return {
            status:false,
            message:"user not found"
          }
        }
        await this.eventRepository.removeLike(eventId,userId)
        
        return {
          status:true,
          message:"Like removed"
        }
      } catch (error) {
        throw error
      }
  }

  async getLikedEventsId(userId: string): Promise<string[] | null> {
      try {
        return await this.eventRepository.getLikedEventIds(userId)
      } catch (error) {
        throw error
      }
  }

  async addNewComment(data: IAddCommentParms): Promise<resObj | null> {
      try {
        await this.eventRepository.addComment(data)
        return {
          status:true,
          message:"new comment addedd"
        }
      } catch (error) {
        throw error
      }
  }

  async getEventComments(eventId: string): Promise<Model<IComments, ICommentsCreationAttributes>[] | null> {
      try {
        return await this.eventRepository.findEventComments(eventId)
      } catch (error) {
        throw error
      }
  }

  async removeComment(commentId: string, userId: string): Promise<resObj | null> {
      try {

        const comment = await this.eventRepository.findCommentById(commentId)
        if(!comment){
          return {
            status:false,
            message:"comment not found!"
          }
        }
        const event = await this.eventRepository.fetchEventDetails(comment?.dataValues.eventId)
        if(comment.dataValues.userId === userId || userId === event?.dataValues.hostsId){
          await this.eventRepository.deleteComment(commentId);
          return {
            status: true,
            message: "comment removed!",
          };
        }else{
          return {
            status: false,
            message:"comments can delete only by event creater or who post comment"
          }
        }
        
      } catch (error) {
        throw error
      }
  }

  async getAdminEventApprovals(): Promise<Model<ILiveStatus, IILiveStatusCreationAttributes>[] | null> {
      try {
        return await this.eventRepository.getAdminEventApprovals()
      } catch (error) {
        throw error
      }
  }

  async approveEventsFund(eventId: string): Promise<resObj | null> {
      try {
        const event = await this.eventRepository.fetchEventDetails(eventId)

        if(!event){
          return {
            status:false,
            message:"event is not found!"
          }
        }
        await this.eventRepository.updateApprovalStatus(eventId)
        const totalAmount = await this.eventRepository.getTotalTicketAmountForEvent(eventId)
        const updateWallet = await this.eventRepository.updateWalletAmount(event.dataValues.hostsId, totalAmount)
        const transactionData: transactionParams = {
          userId:event.dataValues.hostsId,
          transactionType: transactionType.CREDIT,
          paymentMethod: paymentMethod.WALLET,
          purpose: transactionPurpose.EVENT,
          amount: totalAmount,
        };
        const transaction = await this.eventRepository.createTransactions(transactionData)
        const head = "Fund Approved!";
        const message = `Funds of ₹${totalAmount} have been successfully approved for the event ${event.dataValues.eventTitle}.`

        const notification = await this.eventRepository.createNotification(event.dataValues.hostsId,head,message)

        return {
          status:true,
          message:"fund approved!"
        }
      } catch (error) {
        console.log(error);
        
        throw error
      }
  }

  async verifyReportUser(data: IReportUserParams): Promise<resObj | null> {
      try {
        if(data.reporterId===data.reportedUserId){
          return {
            status:false,
            message:"You can't report Your self"
          }
        }

        const response = await this.eventRepository.reportUser(data)
        return {
          status:true,
          message:"report submitted"
        }
      } catch (error) {
        throw error
      }
  }

  async verifyReportEvent(data: IReportEventParams): Promise<resObj | null> {
      try {
        const event = await this.eventRepository.fetchEventDetails(data.reportedEventId)

        if(!event || event.dataValues.hostsId===data.reporterId){
          const message = !event ? "event not found" : "this event is hosted by you!"

          return {
            status:false,
            message:message
          }
        }

        const response = await this.eventRepository.reportEvent(data)
        return {
          status:true,
          message:"report submitted"
        }

      } catch (error) {
        throw error
      }
  }

  async getReportedUsersWithReporters(): Promise<Model<IUser, IUserCreationAttributes>[] | null> {
      try {
        return await this.eventRepository.getReportedUsersWithReporters()
      } catch (error) {
        throw error
      }
  }

  async getReportedEventsWithReporters(): Promise<Model<IEvent, IEventCreationAttributes>[] | null> {
      try {
        return await this.eventRepository.getReportedEventsWithReporters()
      } catch (error) {
        throw error
      }
  }

  async getEventUpdation(eventId: string): Promise<Model<ILiveStatus, IILiveStatusCreationAttributes> | null> {
      try {
        return await this.eventRepository.getEventUpdation(eventId)
      } catch (error) {
        throw error
      }
  }
}
