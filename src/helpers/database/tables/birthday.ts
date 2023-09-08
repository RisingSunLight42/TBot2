import { Table } from "ts-sql-query/Table";
import { DBConnection } from "../DBConnection";

export const tBirthday = new (class tBirthday extends Table<
    DBConnection,
    "tBirthday"
> {
    user_id = this.column("lin_id", "string");
    birthdate = this.column("lin_name", "localDateTime");
    created = this.column("bir_created", "localDateTime");
    updated = this.column("bir_updated", "localDateTime");
    constructor() {
        super("tbot_birthday"); // table name in the database
    }
})();
