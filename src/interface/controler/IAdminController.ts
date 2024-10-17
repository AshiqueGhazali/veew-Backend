import { Request, Response } from "express";

export default interface IAdminController {
  login(req: Request, res: Response): Promise<void>;
  getToken(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  getAllUsers(req: Request, res: Response): Promise<void>;
  blockUser(req: Request, res: Response): Promise<void>;
  addPricingPlan(req: Request, res: Response): Promise<void>;
  getPricingPlans(req: Request, res: Response): Promise<void>;
  editPricingPlan(req: Request, res: Response): Promise<void>;
}
