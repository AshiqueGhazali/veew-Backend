import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { IUserSubscription, IUserSubscriptionCreationAttributes } from "../../entity/userSubscriptionEntity";
import User from "./UserModel";
import Pricing from "./PricingModel";

const UserSubscription: ModelDefined<IUserSubscription, IUserSubscriptionCreationAttributes> =
  sequelize.define(
    "UserSubscription",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "user", key: "id" }, 
      },
      planId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "pricing", key: "id" }, 
      },
      paymentIntentId: {
        type:  DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      expireDate: {
        type: DataTypes.DATE,
        allowNull: true, 
      },
      numberOfEventsUsed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, 
      },
      maxNumberOfEvents: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      tableName: "user_subscription",
      timestamps: true,
      paranoid: true,
    }
  );


export default UserSubscription;
