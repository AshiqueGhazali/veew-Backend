import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../entity/userEntity";
import IUserRepository, {
  editData,
} from "../interface/repository/IUserRepository";
import IuserUseCase, {
  editProfileBody,
} from "../interface/useCase/IUserUseCase";
import IJwtService from "../interface/utils/IJwtService";
import { IPricing, IPricingCreationAttributes } from "../entity/pricingEntity";
import Razorpay from "razorpay";
import Cripto from "crypto";
import { resObj } from "../interface/useCase/IUserAuthUseCase";
import { IStripe } from "../interface/utils/IStripService";

class UserUseCase implements IuserUseCase {
  private userRepository: IUserRepository;
  private jwtService: IJwtService;
  private stripePayment : IStripe

  constructor(userRepository: IUserRepository, jwtService: IJwtService, stripePayment : IStripe) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.stripePayment = stripePayment
  }

  async getUserProfile(
    userId: string
  ): Promise<Model<IUser, IUserCreationAttributes> | null> {
    try {
      return await this.userRepository.fetchProfileData(userId);
    } catch (error) {
      throw error;
    }
  }

  async editUserProfile(data: editProfileBody): Promise<void> {
    try {
      console.log("idddd is :", data.id);

      const editData: editData = {
        firstName: data.firstName,
        lastName: data.lastName,
      };
      if (data.phone) editData.phone = data.phone;
      if (data.gender) editData.gender = data.gender;
      if (data.age) editData.age = data.age;
      if (data.image) editData.image = data.image;

      const response = await this.userRepository.editProfile(data.id, editData);
      return;
    } catch (error) {}
  }

  async editImage(userId: string, image: string): Promise<void> {
    try {
      await this.userRepository.editImage(userId, image);
      return;
    } catch (error) {}
  }

  async getAllPricingPlans(): Promise<
    Model<IPricing, IPricingCreationAttributes>[] | null
  > {
    try {
      const plans = await this.userRepository.fetchAllPlans();
      return plans;
    } catch (error) {
      throw error;
    }
  }

  async createPayment(userId:string,planId: string): Promise<any> {
    try {
      
      const planData = await this.userRepository.fetchPlanData(planId)
      if(!planData){
        return null
      }
      const isUserHavePlan = await this.userRepository.isUserPlanExist(userId,planId)
      if(isUserHavePlan){
        return {
          status:false,
          message:"User Already have same plan!"
        }
      }
      const response = await this.stripePayment.makePayment(planData?.dataValues.price,planId,null)
      console.log("the going resss :",response);

      return {
        status:true,
        sessionId:response
      }

    } catch (error) {
      console.log(error);
      return null
      
    }
  }

  async conformPlanSubscription(userId: string, planId: string, sessionId: string): Promise<resObj | null> {
      try {
        const planData = await this.userRepository.fetchPlanData(planId)

        if(!planData){
          return {
            status:false,
            message:"subscription plan not found"
          }
        }
        const paymentint = await this.stripePayment.getPaymentIntentFromSession(sessionId)        
        if(!paymentint){
          return {
            status:false,
            message:"Payment intent not found"
          }
        }
        const isPlan = await this.userRepository.isUserPlanInSamePayment(paymentint?.id)
        const isPlanExist = await this.userRepository.isUserPlanExist(userId,planId)        

        if(isPlan || isPlanExist){
          return {
            status:false,
            message:"The plan is already subscribed with the same payment"
          } 
        }

        await this.userRepository.addUserSubscription(userId,paymentint.id,planData)
        return {
          status:true,
          message:"plan subscribed successfully"
        }
      } catch (error) {
        console.log(error);
         return null
      }
  }


}

export default UserUseCase;
