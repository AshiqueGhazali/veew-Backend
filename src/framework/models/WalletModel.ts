import { DataTypes, ModelDefined } from "sequelize";
import { IWallet, IWalletCreationAttributes } from "../../entity/walletEntity";
import sequelize from "../config/sequelize";

const Wallet: ModelDefined<IWallet, IWalletCreationAttributes> =
  sequelize.define(
    "Wallet",
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
      balanceAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "wallet",
      timestamps: true,
    }
  );

  export default Wallet