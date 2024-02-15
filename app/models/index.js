import { Sequelize } from 'sequelize';
import 'dotenv/config';
import Notification from './notifications.js';
import Workload from './workload.js';
import Educator from './educator.js';
import User from './user.js';
import TokenModel from './token-model.js';
import SummaryWorkload from './summary-workload.js';

const { DB_USER, DB_PWD, DB_HOST, DB_PORT, DB_NAME } = process.env;

export const models = {
    Notification,
    Educator,
    Workload,
    User,
    TokenModel,
    SummaryWorkload,
};
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        // multipleStatements: true,
        typeCast: true,
    },
    define: {
        // charset: 'utf8mb4',
        // collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        underscored: true,
    },
    logging: false,
});
