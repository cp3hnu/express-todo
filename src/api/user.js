import express from "express"
import { User } from '../utils/database.js';
import { Op } from 'sequelize'

const router = express.Router();

export default router