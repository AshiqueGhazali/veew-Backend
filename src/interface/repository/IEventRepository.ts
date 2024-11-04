import { Model } from "sequelize";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";
import { createEventParams } from "../useCase/IEventUseCase";

export default interface IEventRepository {
    createEvent(userId:string, data:createEventParams):Promise<Model<IEvent,IEventCreationAttributes> | null>
    getAllEvents():Promise<Model<IEvent,IEventCreationAttributes>[] | null>
    getUniqueCategories():Promise<string[] | null>
    fetchEventDetails(eventId:string):Promise<Model<IEvent,IEventCreationAttributes> | null>
    fetchUserEvents(userId:string):Promise<Model<IEvent,IEventCreationAttributes>[] | null>
}