import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { ITicket, ITicketCreationAttributes } from "../../entity/ticketEntity";


const Ticket: ModelDefined<ITicket,ITicketCreationAttributes> =
  sequelize.define(
    "Ticket",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ticketCode:{
        type:DataTypes.STRING,
        allowNull:false
      },
      userId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "user", key: "id" },
      },
      eventId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: "events", key: "id"}
      },
      amount:{
        type: DataTypes.INTEGER,
        allowNull:false
      },
      isCancelled:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: "tickets",
      timestamps: true,
    }
  );


export default Ticket;
