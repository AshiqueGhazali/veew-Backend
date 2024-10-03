import IUserAuthRepository from "../../interface/repository/IUserAuthRepository";
const mailgen = require('mailgen')
import {User} from '../../framework/models/UserModel'


class UserAuthRepository implements IUserAuthRepository {
    async sendOtp(email: string, otp: number): Promise<void> {
        const nodemailer = require('nodemailer');      
        

        console.log(`User OTP is ${otp}`);
        
        // want
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailGenerator = new mailgen({
            theme: "default",
            product: {
                name: "Veew",
                link: "https://mailgen.js/",
            },
        })

        const response = {
            body:{
                name:email,
                intro:"Your OTP for veew verification is :",
                table: {
                    data:[{
                        OTP:otp
                    }]
                },
                outro:"Looking forward to doing more business"
            }
        }

        const mail = mailGenerator.generate(response)

        const message = {
            from : process.env.EMAIL_USERNAME,
            to: email,
            subject:"veew OTP verification",
            html: mail
        }
        
        await transporter.sendMail(message);

       
        // try {
        //     const newUser = await User.create({
        //       firstName: 'Jane',
        //       lastName: 'Smith',
        //       email: 'jane.smith@example.com',
        //       password: 'supersecurepassword',
        //       age: 28,
        //       gender: 'female',
        //     });
        //     console.log('User created successfully:', newUser);
        //   } catch (error) {
        //     console.error('Error creating user:', error);
        //   }
    }
   
}

export default UserAuthRepository;
