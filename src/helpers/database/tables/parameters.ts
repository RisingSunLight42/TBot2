import { Table } from "ts-sql-query/Table";
import { DBConnection } from "../DBConnection";

export const tParameters = new (class tParameters extends Table<
    DBConnection,
    "tParameters"
> {
    name = this.primaryKey("par_name", "string");
    value = this.column("par_value", "string");
    created = this.column("par_created", "localDateTime");
    updated = this.column("par_updated", "localDateTime");
    constructor() {
        super("tbot_parameters"); // table name in the database
    }
})();
