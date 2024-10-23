import { Sequelize } from "sequelize";
// import { User } from '../models/userModel';

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log("Database password:", process.env.DB_PASSWORD);


export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL established successfully");

    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
export default sequelize;
