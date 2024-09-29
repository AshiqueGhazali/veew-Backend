
import { DataTypes, ModelDefined } from 'sequelize';
import { sequelize } from '../config/sequelize';
import { IUser, IUserCreationAttributes } from '../../entity/userEntity';



export const User: ModelDefined<IUser, IUserCreationAttributes> = sequelize.define(
  'User',
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
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'user',
    timestamps: true, 
    paranoid: true,    
  }
);
