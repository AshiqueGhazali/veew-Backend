import { Model } from "sequelize";
import { IEvent, IEventCreationAttributes } from "../entity/eventEntity";
import IEventRepository, {
  createTicketParams,
} from "../interface/repository/IEventRepository";
import IEventUseCase, {
  createEventParams,
  editEventDateParams,
  editEventDetailsParams,
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
      if(getAllTickets?.length || 0 >= event.dataValues.participantCount){
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
      if(getAllTickets?.length || 0 >= event.dataValues.participantCount){
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
}
