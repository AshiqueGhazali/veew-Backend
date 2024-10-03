import sequelize from "../config/sequelize";
import {IOtp,IOtpCreationAttributes} from '../../entity/otpEntity'
import { DataTypes, ModelDefined } from "sequelize";


export const OtpModel:ModelDefined<IOtp,IOtpCreationAttributes> = sequelize.define(
    'UserOtp',
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        otp:{
            type:DataTypes.NUMBER,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        }

    },{
        timestamps:true,
    }
) 