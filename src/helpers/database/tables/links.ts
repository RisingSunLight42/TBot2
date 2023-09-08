import { Table } from "ts-sql-query/Table";
import { DBConnection } from "../DBConnection";

export const tLinks = new (class tLinks extends Table<DBConnection, "tLinks"> {
    id = this.column("lin_id", "int");
    name = this.column("lin_name", "string");
    color = this.column("lin_color", "string");
    description = this.column("lin_description", "string");
    image = this.column("lin_image", "string");
    link = this.column("lin_link", "string");
    created = this.column("lin_created", "localDateTime");
    updated = this.column("lin_updated", "localDateTime");
    constructor() {
        super("tbot_links"); // table name in the database
    }
})();
