import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { INotification, INotificationCreationAttributes } from "../../entity/notificationsEntity";


const Notification: ModelDefined<INotification,INotificationCreationAttributes> = sequelize.define (
    "Notification",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {model: "user", key: "id"}
        },
        notificationHead: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notification: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "notifications",
        timestamps: true,
        paranoid: true
    }
)

export default Notification