import { Request, response, Response } from "express";
import IAdminController, { IPlanDeleteRequest } from "../../interface/controler/IAdminController";
import IAdminUseCase from "../../interface/useCase/IAdminUseCase";

class AdminController implements IAdminController {
  private adminUsecase: IAdminUseCase;

  constructor(adminUseCase: IAdminUseCase) {
    this.adminUsecase = adminUseCase;
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { userName, password } = req.body;
      const status = await this.adminUsecase.verifyLogin({
        userName,
        password,
      });

      if (!status?.status) {
        res
          .status(401)
          .json({ message: "user name and password is incorrect" });
        return;
      }

      res.cookie("adminToken", status.token, { maxAge: 3600000 });
      res.status(200).json({ success: true, message: "login successfull" });
      return;
    } catch (error) {
      throw error;
    }
  }

  async getToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.adminToken;
      if (token) {
        const response = await this.adminUsecase.verifyToken(token);
        res.status(200).json(response);
        return;
      }
      res.status(401).json({ status: false });
      return;
    } catch (error) {
      throw error;
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.cookie("adminToken", "", { httpOnly: true, expires: new Date() });
      res.status(200).json({ status: true, message: "logout completed" });

      return;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const usersData = await this.adminUsecase.getUsersData();

      res.status(200).json(usersData);

      return;
    } catch (error) {
      throw error;
    }
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.body.userId;

      if (userId) {
        await this.adminUsecase.blockUserAndUnblock(userId);
        res.status(200).json({ success: true, message: "okkk" });
        return;
      }

      res.status(401).json({ message: "could't find user" });
      return;
    } catch (error) {
      throw error;
    }
  }

  async addPricingPlan(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const response = await this.adminUsecase.verifyPlan(data);
      if (!response?.status) {
        res.status(404).json(response);
      }
      res.status(200).json(response);
    } catch (error) {
      throw error;
    }
  }

  async getPricingPlans(req: Request, res: Response): Promise<void> {
    try {
      const plans = await this.adminUsecase.getPricingPlans();

      res.status(200).json(plans);
      return;
    } catch (error) {
      throw error;
    }
  }

  async editPricingPlan(req: Request, res: Response): Promise<void> {
    try {
      const { planId, ...editData } = req.body;
      console.log("plan id is:", planId);
      console.log("plan is :", editData);

      const response = await this.adminUsecase.editPricingPlan(
        planId,
        editData
      );
      if (!response.status) {
        res.status(404).json(response.message);
        return;
      }

      res.status(200).json(response.message);
      return;
    } catch (error) {
      throw error;
    }
  }

  async deletePlan(req: IPlanDeleteRequest, res: Response): Promise<void> {
      try {
        const planId = req.query.planId

        const response = await this.adminUsecase.softDeletePlan(planId)

        if(!response?.status){
          res.status(404).json(response)
          return
        }

        res.status(200).json(response)
        return;
      } catch (error) {
        throw error;
      }
  }
}

export default AdminController;
