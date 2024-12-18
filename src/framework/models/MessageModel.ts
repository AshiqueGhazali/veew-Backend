// import { DataTypes, ModelDefined } from "sequelize";
// import sequelize from "../config/sequelize";
// import { IMessage, IMessageCreationAttributes } from "../../entity/realTimeMessageEntity";


// const Message: ModelDefined<IMessage,IMessageCreationAttributes> =
//   sequelize.define(
//     "Message",
//     {
//       id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//       },
//       senderId:{
//         type: DataTypes.UUID,
//         allowNull: false,
//         references: {model: "user", key: "id"}
//       },
//       receiverId: {
//         type: DataTypes.UUID,
//         allowNull: false,
//         references: {model: "user", key: "id"}
//       },
//       message: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       }
      
//     },
//     {
//       tableName: "message",
//       timestamps: true,
//       paranoid: true
//     }
//   );


// export default Message;

import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { IMessageEntity, IMessageEntityCreationAttributes } from "../../entity/messageEntity";


const Message: ModelDefined<IMessageEntity,IMessageEntityCreationAttributes> =
  sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      conversationId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: "conversation", key: "id"}
      },
      senderId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: "user", key: "id"}
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: "user", key: "id"}
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
      
    },
    {
      tableName: "message",
      timestamps: true,
      paranoid: true
    }
  );


export default Message;

