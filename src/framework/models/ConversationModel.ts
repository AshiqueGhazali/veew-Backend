import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { IConversation, IConversationCreationAttributes } from "../../entity/conversationEntity";


const Conversation: ModelDefined<IConversation,IConversationCreationAttributes> =
  sequelize.define(
    "Conversation",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstUserId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: "user", key: "id"}
      },
      secondUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: "user", key: "id"}
      },
      
    },
    {
      tableName: "conversation",
      timestamps: true,
      paranoid: true
    }
  );


export default Conversation;
