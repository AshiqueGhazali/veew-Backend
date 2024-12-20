import { Request, Response } from "express";
import IUserAuthUseCase, {
  loginBody,
  registerBody,
} from "../../interface/useCase/IUserAuthUseCase";
import IUserAuthController, {
  emailBody,
} from "../../interface/controler/IUserAuthController";
import app from "../../framework/config/app";

class UserAuthController implements IUserAuthController {
  private userAuthUseCase: IUserAuthUseCase;

  constructor(userAuthUseCase: IUserAuthUseCase) {
    this.userAuthUseCase = userAuthUseCase;
  }

  async sendOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    try {
      const authenticateUser = await this.userAuthUseCase.isEmailExist(email);

      if (!authenticateUser?.status) {
        res.status(401).json({ message: authenticateUser?.message });
        return;
      }

      await this.userAuthUseCase.sendOtp(email);
      app.locals.email = email;
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async sendForgotPasswordOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    try {
      const isUser = await this.userAuthUseCase.isEmailExist(email);

      if (isUser?.status) {
        res.status(401).json({ message: "user not exist in this email" });
        return;
      }

      await this.userAuthUseCase.sendOtp(email);
      app.locals.email = email;
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const otp = req.body.userOtp;

    try {
      const status = await this.userAuthUseCase.verifyOtp(
        app.locals.email,
        otp
      );

      if (status?.status) {
        res.status(200).json({ success: true, messega: status?.message });
      } else {
        res.status(401).json({ message: "otp verification failed" });
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
    const { userOtp, email } = req.body;

    try {
      const status = await this.userAuthUseCase.verifyForgotPasswordOtp(
        email,
        userOtp
      );

      if (status?.status) {
        res.status(200).json({ success: true, messega: status?.message });
      } else {
        res.status(401).json({ message: "otp verification failed" });
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    const data: registerBody = { ...req.body, email: app.locals.email };

    try {
      await this.userAuthUseCase.UserRegister(data);

      res
        .status(200)
        .json({ success: true, message: "successfylly created new account" });
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const loginBody: loginBody = req.body;

    try {
      const status = await this.userAuthUseCase.authenticateUser(loginBody);

      if (!status?.status) {
        res.status(400).json({ message: status?.message });
        return;
      }

      const { token } = status;

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000,
      });

      res.status(200).json(status);
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.cookie("token", "", { httpOnly: true, expires: new Date() });
      res.status(200).json({ status: true, message: "logout completed" });
    } catch (error) {
      res.status(500).json(error)
      return
    }
  }

  async getToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.token;
      const response = await this.userAuthUseCase.verifyToken(token);
      if(response.status){
        res.status(200).json(response);
        return
      }

      res.status(401).json({message:"user not found"})
    } catch (error) {
      res.status(500).json(error)
      return
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { password, email } = req.body;

    try {
      const response = await this.userAuthUseCase.userResetPassword(
        email,
        password
      );

      if (response?.status) {
        res.status(200).json(response.message);
        return;
      }

      res.status(401).json(response?.message);
      return;
    } catch (error) {
      res.status(500).json(error)
      return
    }
  }

  async googleAuth(req: Request,res: Response): Promise<void> {
    try {


      const { email, firstName, lastName, image } = req.body;
      let data = {email, firstName, lastName, image};

      let response = await this.userAuthUseCase.googleAuthenticateUser(data);

      console.log(email, image, "hiiii");

      if (response?.status) {
        const { token } = response;
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000,
        });

        res.status(200).json(response);
        return
      }
    } catch (error) {
      res.status(500).json(error)
      return
    }

  }
}

export default UserAuthController;
