import { Model, ModelDefined, Sequelize, where } from "sequelize";
import IEventRepository from "../../interface/repository/IEventRepository";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import {
  createEventParams,
  editEventDateParams,
  editEventDetailsParams,
} from "../../interface/useCase/IEventUseCase";
import { table } from "console";

export default class EventRepository implements IEventRepository {
  private EventModel: ModelDefined<IEvent, IEventCreationAttributes>;
  private UserModel: ModelDefined<IUser, IUserCreationAttributes>;

  constructor(
    EventModel: ModelDefined<IEvent, IEventCreationAttributes>,
    UserModel: ModelDefined<IUser, IUserCreationAttributes>
  ) {
    this.EventModel = EventModel;
    this.UserModel = UserModel;
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
}
