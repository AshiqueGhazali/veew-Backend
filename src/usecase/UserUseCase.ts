import { Model } from "sequelize";
import { IUser, IUserCreationAttributes } from "../entity/userEntity";
import IUserRepository, {
  editData,
} from "../interface/repository/IUserRepository";
import IuserUseCase, {
  createPlanResponse,
  editProfileBody,
  verifyPlanParams,
} from "../interface/useCase/IUserUseCase";
import IJwtService from "../interface/utils/IJwtService";
import { IPricing, IPricingCreationAttributes } from "../entity/pricingEntity";
import Razorpay from "razorpay";
import Cripto from "crypto";
import { resObj } from "../interface/useCase/IUserAuthUseCase";

class UserUseCase implements IuserUseCase {
  private userRepository: IUserRepository;
  private jwtService: IJwtService;

  constructor(userRepository: IUserRepository, jwtService: IJwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
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

  async createPayment(planId: string): Promise<createPlanResponse | null> {
      try {
        function generateOrderId(): string {
          const timestamp = Date.now(); 
          const randomNum = Math.floor(Math.random() * 1000000); 
          return `ORD-${timestamp}-${randomNum}`;
        }

        const planData = await this.userRepository.fetchPlanData(planId)

        if(planData){
          const amount = planData.dataValues.price
          const orderId = generateOrderId()

        const insternce = new Razorpay({
          key_id: process.env.RAZORPAY_ID_KEY || '',
          key_secret: process.env.RAZORPAY_SECRET_KEY,
        });
  
        const options = {
          amount: amount * 100,
          currency: "INR",
          receipt: orderId,
        };
        const order = await insternce.orders.create(options);
  
        if (!order) {
          return null
        }
  
        return{
            key: process.env.RAZORPAY_ID_KEY || '',
            amount: options.amount,
            orderId: orderId,
            currency: options.currency,
          }
        }

        return null
  
      } catch (error) {
        console.log(error);
        return null
        
      }
  }

  async verifyPayment(data: verifyPlanParams): Promise<resObj | null> {
      try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature , orderCreationId} = data;
        console.log('Order is is :',razorpayOrderId);
        console.log('payment iss :',razorpayPaymentId);
        console.log('signnnn iss :', razorpaySignature);
        console.log("orderCreationId :::",orderCreationId);
        
        
        
        

        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);

        hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpaySignature) {
            return {
              status:true,
              message:"all successs"
            };
        } else {
          return {
            status:false,
            message:"not verified"
          };
        }
      } catch (error) {
        console.log(error);
        return null
      }
  }
}

export default UserUseCase;
