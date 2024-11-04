import { Model } from "sequelize";
import { IEvent, IEventCreationAttributes } from "../entity/eventEntity";
import IEventRepository from "../interface/repository/IEventRepository";
import IEventUseCase, { createEventParams } from "../interface/useCase/IEventUseCase";
import { resObj } from "../interface/useCase/IUserAuthUseCase";

export default class EventUseCase implements IEventUseCase {
    private eventRepository : IEventRepository
    
    constructor(eventRepository:IEventRepository){
        this.eventRepository = eventRepository
    }

    async verifyEventCreation(userId: string, data: createEventParams): Promise<resObj | null> {
        try {
            const response = await this.eventRepository.createEvent(userId,data) 
            
            if(!response){
                return {
                    status : false,
                    message : "somthing went wrong!"
                }
            }

            return {
                status : true,
                message : "new event added!"
            }
            
        } catch (error) {
            throw error
        }
    }

    async getAllEvents(): Promise<Model<IEvent, IEventCreationAttributes>[] | null> {
        try {
            return await this.eventRepository.getAllEvents()
        } catch (error) {
            console.log(error);
            return null   
        }
    }

    async findAllCategories(): Promise<string[] | null> {
        try {
            return await this.eventRepository.getUniqueCategories()
        } catch (error) {
            throw error
        }
    }

    async verityEvent(eventId: string): Promise<Model<IEvent, IEventCreationAttributes> | null> {
        try {
            return await this.eventRepository.fetchEventDetails(eventId)
        } catch (error) {
            throw error
        }
    }

    async verifyUserEvents(userId: string): Promise<Model<IEvent, IEventCreationAttributes>[] | null> {
        try {
            return this.eventRepository.fetchUserEvents(userId)
        } catch (error) {
            throw error
        }
    }
}