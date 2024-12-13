import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { IUserReport, IUserReportCreationAttributes } from "../../entity/userReportEntity";


const UserReport: ModelDefined<IUserReport, IUserReportCreationAttributes> =
  sequelize.define(
    "UserReport",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reporterId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "user", key: "id" }, 
      },
      reportedUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "user", key: "id" }, 
      },
      reason :{
        type: DataTypes.TEXT,
        allowNull: false,
      }
    },
    {
      tableName: "user_report",
      timestamps: true,
      paranoid: true,
    }
  );


export default UserReport;
