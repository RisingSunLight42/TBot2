import { MariaDBConnection } from "ts-sql-query/connections/MariaDBConnection";

export class DBConnection extends MariaDBConnection<"DBConnection"> {
    protected alwaysUseReturningClauseWhenInsert = true;
}
