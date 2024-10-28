import { Response, NextFunction } from "express";
import IEventController from "../../interface/controler/IEventController";
import { IAuthRequest } from "../../interface/controler/IUserController";
import IEventUseCase, { createEventParams } from "../../interface/useCase/IEventUseCase";


export default class EventController implements IEventController {
    private eventUseCase : IEventUseCase

    constructor(eventUseCse:IEventUseCase){
        this.eventUseCase = eventUseCse
    }

    async createEvent(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId || '';
            const imageUrl = req.file?.path || '';
            const {eventTitle,category,description,date,startTime,endTime,participantCount,ticketPrice} = req.body

            const eventsDetails:createEventParams = {
                eventTitle,
                category,
                description,
                date,
                startTime,
                endTime,
                participantCount:Number(participantCount),
                ticketPrice: Number(ticketPrice),
                imageUrl:imageUrl 
            }            
            
            const response = await this.eventUseCase.verifyEventCreation(userId,eventsDetails)

            if(response?.status){
                res.status(200).json(response)
                return;
            }

            res.status(404).json(response)
            return
        } catch (error) {
            res.status(500).json({message:error})
            console.log(error);
            return
        }
    }
}