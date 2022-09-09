// Import dependencies
import {
    Client,
    Collection,
    RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

export interface ClientExtend extends Client {
    commands?: Collection<
        string,
        {
            data: RESTPostAPIApplicationCommandsJSONBody;
            execute: AsyncGeneratorFunction;
        }
    >;
}
