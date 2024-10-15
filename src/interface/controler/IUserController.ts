import { Request, Response , NextFunction} from "express";

export interface IAuthRequest extends Request {
    userId?:string;
}

export default interface IUserController {
    getUserData(req:IAuthRequest,res:Response,next:NextFunction):Promise<void>;
    editUserProfile(req:IAuthRequest,res:Response,next:NextFunction):Promise<void>;
    uploadProfileImg(req:IAuthRequest,res:Response,next:NextFunction):Promise<void>
}