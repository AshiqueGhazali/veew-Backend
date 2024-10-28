import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { IEvent, IEventCreationAttributes } from "../../entity/eventEntity";


const Events: ModelDefined<IEvent,IEventCreationAttributes> = sequelize.define (
    "Events",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        hostsId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {model: "user", key: "id"}
        },
        eventTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        participantCount: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
        ticketPrice: {
            type: DataTypes.NUMBER,
            allowNull: true,
            defaultValue: 0
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "events",
        timestamps: true,
        paranoid: true
    }
)

export default Events