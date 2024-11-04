import { NextFunction,  Response } from "express";
import IUserController, {IAuthRequest} from "../../interface/controler/IUserController";
import IuserUseCase from "../../interface/useCase/IUserUseCase";

class UserController implements IUserController {
  private userUseCase: IuserUseCase;

  constructor(userUseCase: IuserUseCase) {
    this.userUseCase = userUseCase;
  }

  async getUserData(
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let userId: string = req.userId as string;

      const data = await this.userUseCase.getUserProfile(userId);
      if (!data) {
        res.json(401).json({ message: "could't find user" });
        return;
      }
      res.status(200).json({ userData: data });
    } catch (error) {
      throw error;
    }
  }

  async editUserProfile(
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, firstName, lastName, phone, gender, age, image } = req.body;
      console.log(req.body);
      await this.userUseCase.editUserProfile({
        id,
        firstName,
        lastName,
        phone,
        gender,
        age,
        image,
      });

      res.status(200).json({ success: true, message: "profile updated" });

      return;
    } catch (error) {
      throw error;
    }
  }

  async uploadProfileImg(
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const imageUrl = req.file?.path;
      if (req.userId && imageUrl) {
        await this.userUseCase.editImage(req.userId, imageUrl);
        res.status(200).json({ imageUrl });
        return;
      } else {
        res.status(401).json({ message: "user id is not getting" });
      }
    } catch (error) {}
  }

  async getAllPlans(
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await this.userUseCase.getAllPricingPlans();
      if (!response) {
        res.status(401).json({ message: "not plans" });
        return;
      }

      res.status(200).json(response);
      return;
    } catch (error) {
      res.status(500)
      console.log(error);
    }
  }

  async createPayment(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const userId = req.userId || ''
        const {planId} = req.body

        console.log("plan id is ::",req.body);
        

        const response = await this.userUseCase.createPayment(userId,planId)
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

  async conformSubscription(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {

        const userId = req.userId || ''
        const {planId,sessionId} = req.body

        const response = await this.userUseCase.conformPlanSubscription(userId,planId,sessionId)

        console.log(" constroller ressppoooo is :",response);
        

        if(response?.status){
          res.status(200).json(response)
          return
        }

        res.status(400).json(response)
        return   
      } catch (error) {
        res.status(500)
        console.log(error);
      }
  }

  async getUserSubscriptionPlan(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const userId = req.userId || '';
        console.log("hiiii user :",userId);
        
        const response = await this.userUseCase.getUserSubscriptionPlan(userId)
        if(!response){
          res.status(404).json({message:"user have no subscription file exist"})
          return;
        }

        res.status(200).json(response)
        return
      } catch (error) {
        res.status(500)
        console.log(error);
      }
  }

}

export default UserController;
