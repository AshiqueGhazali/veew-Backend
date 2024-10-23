import { DataTypes, Model, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";

import { IUser, IUserCreationAttributes } from "../../entity/userEntity";
import UserSubscription from "./UserSubscriptionModel";

const User: ModelDefined<IUser, IUserCreationAttributes> = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isBlock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "user",
    timestamps: true,
  }
);

// User.hasMany(UserSubscription, {
//   foreignKey: "userId", 
//   as: "subscriptions"
// });

export default User;
