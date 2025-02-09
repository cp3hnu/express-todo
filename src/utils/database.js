import { Sequelize, DataTypes } from "sequelize";
import { dirJoin } from "./index.js";

const filePath = dirJoin('data/database.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: filePath
});

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
});

export const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.STRING,
  completed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

User.hasMany(Task);
Task.belongsTo(User);

export const authenticateAndSync = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return Promise.reject(error);
  }
}