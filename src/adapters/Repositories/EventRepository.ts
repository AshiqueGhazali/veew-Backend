import { Model, ModelDefined } from "sequelize";
import IEventRepository from "../../interface/repository/IEventRepository";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import { createEventParams } from "../../interface/useCase/IEventUseCase";


export default class EventRepository implements IEventRepository {
    private EventModel : ModelDefined<IEvent,IEventCreationAttributes>
    private UserModel: ModelDefined<IUser, IUserCreationAttributes>;

    constructor(
        EventModel : ModelDefined<IEvent,IEventCreationAttributes>,
        UserModel: ModelDefined<IUser, IUserCreationAttributes>
    )
    {
        this.EventModel = EventModel;
        this.UserModel = UserModel;
    }

    async createEvent(userId: string, data: createEventParams): Promise<Model<IEvent, IEventCreationAttributes> | null> {
        try {
            return null
        } catch (error) {
            throw error
        }
    }
}