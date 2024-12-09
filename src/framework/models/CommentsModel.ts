import sequelize from "../config/sequelize";
import { DataTypes, ModelDefined } from "sequelize";
import {
  IComments,
  ICommentsCreationAttributes,
} from "../../entity/commentsEntity";

const Comments: ModelDefined<IComments, ICommentsCreationAttributes> =
  sequelize.define("Comments", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "events", key: "id" },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "user", key: "id" },
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "comments",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  },
  {
    tableName: "comments",
    timestamps: true,
    paranoid: true
  }
);


export default Comments;