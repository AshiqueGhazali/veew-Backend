import sequelize from "../config/sequelize";
import { IOtp, IOtpCreationAttributes } from "../../entity/otpEntity";
import { DataTypes, ModelDefined } from "sequelize";

const OtpModel: ModelDefined<IOtp, IOtpCreationAttributes> = sequelize.define(
  "UserOtp",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "otpTable",
    timestamps: true,
  }
);

export default OtpModel;
