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
            console.log("userId is :",userId);
            console.log("data is :",data);

            return null    

            
        } catch (error) {
            throw error
        }
    }
}