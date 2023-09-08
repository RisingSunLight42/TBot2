import { createPool } from "mariadb";
require("dotenv").config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;

if (!dbHost) throw new Error("Database's host is missing !");
if (!dbUser) throw new Error("Database's user is missing !");
if (!dbPassword) throw new Error("Database's password is missing !");
if (!dbDatabase) throw new Error("Database's database is missing !");

export const pool = createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
    connectionLimit: 5,
});