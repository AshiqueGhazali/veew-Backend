import { DataTypes, ModelDefined } from "sequelize";
import {
  ITransaction,
  ITransactionCreationAttributes,
} from "../../entity/transactionEntity";
import sequelize from "../config/sequelize";

const Transaction: ModelDefined<ITransaction, ITransactionCreationAttributes> =
  sequelize.define(
    "Transaction",
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
      transactionType: {
        type: DataTypes.ENUM("CREDIT", "DEBIT"),
        allowNull: false,
      },
      paymentIntentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.ENUM("WALLET","ONLINE"),
        allowNull: false,
      },
      purpose: {
        type: DataTypes.ENUM("WALLET", "PRICING", "TICKET"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "transactions",
    }
  );

export default Transaction;
