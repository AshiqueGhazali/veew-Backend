import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { IILiveStatusCreationAttributes, ILiveStatus } from "../../entity/liveStatus";


const LiveStatus: ModelDefined<ILiveStatus,IILiveStatusCreationAttributes> =
  sequelize.define(
    "LiveStatus",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      eventId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: "events", key: "id"}
      },
      startTime:{
        type: DataTypes.STRING,
        allowNull: true
      },
      endTime:{
        type: DataTypes.STRING,
        allowNull: true
      }
      
    },
    {
      tableName: "livestatus",
      timestamps: true,
    }
  );


export default LiveStatus;
