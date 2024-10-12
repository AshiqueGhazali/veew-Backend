// import { NextFunction, Request, Response } from "express";
// import JwtService from "../../utils/jwtService";

// const jwtservice = new JwtService();

// const authorization = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {

//     const token = req.cookies.adminToken;
//     const verification = await jwtservice.verify(token); // ineed imple token veryifht
//     next();

//   } catch (error) {    
//     return res
//     .status(401).json({ message:"Admin is not authenticated", error: error });
//   }
// };

// export default authorization;

import { NextFunction, Request, Response } from "express";
import JwtService from "../../utils/jwtService";

const jwtservice = new JwtService();

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.adminToken
    
        
    next();

  } catch (error) {    
    res.status(401).json({ message: "Admin is not authenticated", error: error });
  }
};

export default authorization;
