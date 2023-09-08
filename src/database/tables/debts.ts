import { Table } from "ts-sql-query/Table";
import { DBConnection } from "../DBConnection";

export const tDebts = new (class tDebts extends Table<DBConnection, "tDebts"> {
    user_id = this.column("deb_user_id", "string");
    user_indebt = this.column("deb_user_indebt", "string");
    debt = this.column("deb_debt", "string");
    created = this.column("deb_created", "localDateTime");
    updated = this.column("deb_updated", "localDateTime");
    constructor() {
        super("tbot_debts"); // table name in the database
    }
})();
