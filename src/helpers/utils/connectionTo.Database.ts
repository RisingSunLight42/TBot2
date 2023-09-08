import { MariaDBPoolQueryRunner } from "ts-sql-query/queryRunners/MariaDBPoolQueryRunner";
import { pool } from "../constants/pool";
import { DBConnection } from "../database/DBConnection";

export const connectionToDatabase = () => {
    return new DBConnection(new MariaDBPoolQueryRunner(pool));
};
