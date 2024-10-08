import { tokenData } from "../../interface/controler/IUserAuthController";
import IJwtService, { DecodedJwt } from "../../interface/utils/IJwtService";
import Jwt, { DecodeOptions, decode } from "jsonwebtoken";





export default class JwtService implements IJwtService {

  createToken(data:tokenData): string {
    try {
      let secret: string = process.env.JWT_SECRET_key!;
      let token = Jwt.sign(data, secret, { expiresIn: "1h" });
      return token;
    } catch (error) {   
      throw error;
    }
  }


  verify(token: string):DecodedJwt|null{
  
     try {
      const decoded=Jwt.verify(token,process.env.JWT_SECRET_KEY!)  as DecodedJwt

      return decoded

     } catch (error) {  
      
      if (error instanceof Jwt.TokenExpiredError) {
        return null; 
    } else {
        console.error("JWT Verification Error:", error);
        throw new Error("JWT Verification Error");
    }

     }




  }


}