import { DataTypes, Model, ModelDefined} from 'sequelize';
import sequelize from '../config/sequelize';


import { IUser, IUserCreationAttributes } from '../../entity/userEntity';


export const User : ModelDefined<IUser,IUserCreationAttributes> = sequelize.define(
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
  },{
    tableName: 'user',  
    timestamps: true,   
  })


// export class User extends Model<IUser, IUserCreationAttributes> implements IUser {
//   public id!: string;
//   public firstName!: string;
//   public lastName!: string;
//   public email!: string;
//   public password!: string;
//   public age?: number;
//   public gender?: string;

//   // Timestamps
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// User.init({
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },
//   firstName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   lastName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   age: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   },
//   gender: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
// }, {
//   sequelize,          
//   tableName: 'user',  
//   timestamps: true,   
// },
// );

// ####################################################

// import { DataTypes, Model, Sequelize} from 'sequelize';
// // import { IUser, IUserCreationAttributes } from '../../entity/userEntity';


// export default class User extends Model {
//   public id!: string;
//   public firstName!: string;
//   public lastName!: string;
//   public email!: string;
//   public password!: string;
//   public age?: number;
//   public gender?: string;

//   // Timestamps
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }
// export const UserMap = (sequelize: Sequelize) => {
//   User.init({
//       id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//       },
//       firstName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       lastName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       age: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//       },
//       gender: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//     }, {
//       sequelize,          
//       tableName: 'user',  
//       timestamps: true,   
//     },);
//   User.sync();
// }