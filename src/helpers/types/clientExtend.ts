// Import dependencies
import {
    Client,
    Collection,
    RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { Database } from "firebase/database";

export interface ClientExtend extends Client {
    commands?: Collection<
        string,
        {
            data: RESTPostAPIApplicationCommandsJSONBody;
            execute: AsyncGeneratorFunction;
        }
    >;
    database?: Database;
}
