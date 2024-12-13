import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { IEventReport, IEventReportCreationAttributes } from "../../entity/eventReportEntity";


const EventReport: ModelDefined<IEventReport, IEventReportCreationAttributes> =
  sequelize.define(
    "EventReport",
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
      tableName: "event_report",
      timestamps: true,
      paranoid: true,
    }
  );


export default EventReport;
