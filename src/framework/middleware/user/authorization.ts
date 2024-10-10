
import { NextFunction, Response } from "express";
import {IAuthRequest} from '../../../interface/controler/IUserController';
import JwtService from "../../utils/jwtService";

const jwtService = new JwtService();

const authorizationMiddleware = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    const token = req.cookies.token;
    let verification = jwtService.verify(token);
    req.userId = verification?.id as string;
    next();

  } catch (error) {
    res.status(401).json({ message:"userTokenExpired"});
  }
};

export default authorizationMiddleware;
