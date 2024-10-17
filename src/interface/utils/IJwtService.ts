import exp from "constants";
import { tokenData } from "../controler/IUserAuthController";

export interface DecodedJwt {
  id: string;
  role: string;
  userName?: string;
  exp: number;
  iat: number;
}

export interface DecodedJwt {
  id: string;
  role: string;
  userName?: string;
  iat: number;
  exp: number;
}

export default interface IJwtService {
  createToken(data: tokenData): string;
  verify(token: string): DecodedJwt | null;
}
