import { Model } from "sequelize";
import { IEvent, IEventCreationAttributes } from "../entity/eventEntity";
import IEventRepository from "../interface/repository/IEventRepository";
import IEventUseCase, { createEventParams, editEventDateParams, editEventDetailsParams } from "../interface/useCase/IEventUseCase";
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

    async verifyEditEventDetails(eventId: string, data: editEventDetailsParams): Promise<resObj | null> {
        try {
            await this.eventRepository.editEventDetails(eventId,data)
            return {
                status:true,
                message:'succefully edited'
            }
        } catch (error) {
            throw error
        }
    }

    async verifyEditEventDate(eventId: string, data: editEventDateParams): Promise<resObj | null> {
        try {
            await this.eventRepository.editEventDate(eventId,data)
            return {
                status:true,
                message:'succefully edited'
            }
        } catch (error) {
            throw error
        }
    }

    async verifyEventCancellation(eventId: string): Promise<resObj | null> {
        try {
            const event = await this.eventRepository.fetchEventDetails(eventId)

            if(!event){
                return{
                    status:false,
                    message:"Event Not Found"
                }
            }else{
                const currentDate = new Date();
                const eventDate = new Date(event.dataValues.date)
                const eventDateOnly = eventDate.toDateString();
                const currentDateOnly = currentDate.toDateString();

                if (eventDate< currentDate && eventDateOnly !== currentDateOnly) {
                    return{
                        status:false,
                        message:"Can't Cancel past events!"
                    }
                }

                const startDateTime = new Date(`${eventDate}T${event.dataValues.startTime}`);
                const endDateTime = new Date(`${eventDate}T${event.dataValues.endTime}`);

                if (eventDateOnly === currentDateOnly) {
                    const currentTime =
                      currentDate.getHours() * 60 + currentDate.getMinutes();
                    const startMinutes =
                      startDateTime.getHours() * 60 + startDateTime.getMinutes();
                    const endMinutes = endDateTime.getHours() * 60 + endDateTime.getMinutes();
              
                    if (startMinutes < currentTime || endMinutes < currentTime) {
                        return{
                            status:false,
                            message:"The Event Time is finished"
                        }
                    }
                }
            }


            await this.eventRepository.cancellEvent(eventId)
            
            return{
                status:true,
                message:"Event Cancelled"
            }
        } catch (error) {
            throw error
        }
    }
}