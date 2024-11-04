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
            type: DataTypes.STRING,
            allowNull: false
        },
        endTime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        participantCount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ticketPrice: {
            type: DataTypes.INTEGER,
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