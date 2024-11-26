import { Response, NextFunction, Request } from "express";
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

            console.log("the image url is :",imageUrl);
            

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

    async getAllEvents(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.eventUseCase.getAllEvents()
            if(response){
                res.status(200).json(response)
            }
        } catch (error) {
            res.status(500).json({message:error})
            console.log(error);
            return
        }
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.eventUseCase.findAllCategories()
            
            if(categories){
                res.status(200).json(categories)
                return
            }
            res.status(401).json({message:'not found'})
            return
        } catch (error) {
            res.status(500).json({message:error})
            console.log(error);
            return
        }
    }

    async getEventDetails(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const eventId:string = req.query.eventId as string

            console.log("the event id is :",eventId);

            const response = await this.eventUseCase.verityEvent(eventId)

            if(response){
                res.status(200).json(response)
                return
            }
            res.status(401).json({message:'not found'})
            return
            
        } catch (error) {
            res.status(500).json({message:error})
            console.log(error);
            return
        }
    }

    async getEventsOfUser(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId ? req.userId : req.query.userId as string

            const response = await this.eventUseCase.verifyUserEvents(userId)

            if(response){
                res.status(200).json(response)
                return 
            }

            res.status(404).json({message:"Not found"})
            return
        } catch (error) {
            res.status(500).json({message:error})
            console.log(error);
            return
        }
    }

    async editEventDetails(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {eventId , eventTitle , description , ticketPrice} = {...req.body}
            const data = {
                eventTitle ,
                description ,
                ticketPrice
            }

            const response = await this.eventUseCase.verifyEditEventDetails(eventId,data)
            if(response?.status){
                res.status(200).json(response)
                return
            }
            res.status(400).json('somthing went wrong')   
        } catch (error) {
            res.status(500).json({message:error})
            console.log(error);
            return
        }
    }

    async editEventDate(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {eventId , date , startTime , endTime} = {...req.body}
            const data = {
                date ,
                startTime ,
                endTime
            }

            const response = await this.eventUseCase.verifyEditEventDate(eventId,data)
            if(response?.status){
                res.status(200).json(response)
                return
            }
            res.status(400).json('somthing went wrong')   
        } catch (error) {
            res.status(500).json({message:error})
            console.log(error);
            return
        }
    }

    async cancelEvent(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const eventId = req.query.eventId as string

            const response = await this.eventUseCase.verifyEventCancellation(eventId)

            if(response?.status){
                res.status(200).json(response.message)
                return
            }

            res.status(400).json(response?.message)
            return;
            
        } catch (error) {
            res.status(500).json({message:error})
            console.log(error);
            return
        }
    }

    async bookTicket(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
          const userId = req.userId as string
          const {eventId} = req.body
  
          const response = await this.eventUseCase.verifyTicketBooking(userId,eventId)
  
          if(response?.status){
            res.status(200).json({ sessionId: response.sessionId })
            return
          }
          res.status(400).json({message:response?.message})
          return
        } catch (error) {
          res.status(500)
          console.log(error);
        }
    }

    async conformTicketBooking(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId as string
            const {eventId , sessionId} = req.body

            const response = await this.eventUseCase.conformTicketBooket(userId,eventId,sessionId)

            console.log(response);
            

            if(response?.status){
                res.status(200).json(response)
                return
            }

            res.status(401).json(response)
        } catch (error) {
            res.status(500)
            console.log(error);
        }
    }

    async bookTicketWithWallet(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.userId as string
            const {eventId} = req.body

            const response = await this.eventUseCase.verifyTicketBookingWithWallet(userId,eventId)

            if(response?.status){
                res.status(200).json(response)
                return
            }

            res.status(401).json(response)
            return
        } catch (error) {
            res.status(500)
            console.log(error);
        }
    }

    async getAllTicketsData(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.eventUseCase.getAllTicketsData()

            if(response){
                res.status(200).json(response)
                return
            }

            res.status(400).json({message:"not found!"})
        } catch (error) {
            res.status(500)
            console.log(error);
        }
    }

    async getAllUserTickets(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId as string

            const response = await this.eventUseCase.getAllUserTickets(userId)

            if(response){
                res.status(200).json(response)
                return
            }

            res.status(400).json({message:"not found!"})
        } catch (error) {
            res.status(500)
            console.log(error);
        }
    }

    async userCancelTicket(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId as string;
            const {ticketId} = req.body

            const response = await this.eventUseCase.userCancelTicket(userId,ticketId)

            if(response?.status){
                res.status(200).json(response)
                return
            }

            res.status(400).json(response?.message)
        } catch (error) {
            res.status(500)
            console.log(error);
        }
    }

    async getAllTicketForEvent(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const eventId = req.query.eventId as string

            const response = await this.eventUseCase.getAllTicketForEvent(eventId)

            if(response){
                res.status(200).json(response)
                return
            }

            res.status(400).json(response)

        } catch (error) {
            res.status(500)
            console.log(error);
        }
    }
}