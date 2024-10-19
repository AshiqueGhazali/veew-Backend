import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import {
  IPricing,
  IPricingCreationAttributes,
} from "../../entity/pricingEntity";

const Pricing: ModelDefined<IPricing, IPricingCreationAttributes> =
  sequelize.define(
    "Pricing",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM("PRICING", "SUBSCRIPTION"),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      numberOfEvents: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expireAfter: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      maxParticipents: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idealFor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "pricing",
      timestamps: true,
      paranoid: true
    }
  );

export default Pricing;
