import { IOtpService } from "../../interface/utils/IOtpService";
const mailgen = require("mailgen");
const nodemailer = require("nodemailer");

export default class OtpService implements IOtpService {
  generateOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  async sendOtp(email: string, otp: number): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailGenerator = new mailgen({
      theme: "default",
      product: {
        name: "Veew",
        link: "https://mailgen.js/",
      },
    });

    const response = {
      body: {
        name: email,
        intro: "Your OTP for veew verification is :",
        table: {
          data: [
            {
              OTP: otp,
            },
          ],
        },
        outro: "Looking forward to doing more business",
      },
    };

    const mail = mailGenerator.generate(response);

    const message = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "veew OTP verification",
      html: mail,
    };

    await transporter.sendMail(message);
  }
}
