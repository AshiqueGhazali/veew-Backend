import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { IILikesCreationAttributes, ILikes } from "../../entity/likesEntity";


const Likes: ModelDefined<ILikes,IILikesCreationAttributes> =
  sequelize.define(
    "Likes",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      eventId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: "events", key: "id"}
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: "user", key: "id"}
      }
      
    },
    {
      tableName: "likes",
      timestamps: true,
      paranoid: true
    }
  );


export default Likes;
