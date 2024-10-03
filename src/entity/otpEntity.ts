export interface IOtp {
    id:string;
    email:string;
    otp:number;
}

export interface IOtpCreationAttributes extends Omit<IOtp, 'id'>{}