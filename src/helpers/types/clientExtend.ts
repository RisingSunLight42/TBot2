// Import dependencies
import {
    Client,
    Collection,
    EmbedBuilder,
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
    buttons?: Collection<
        string,
        {
            name: string;
            execute: AsyncGeneratorFunction;
        }
    >;
    menus?: Collection<
        string,
        {
            name: string;
            execute: AsyncGeneratorFunction;
        }
    >;
    modals?: Collection<
        string,
        {
            name: string;
            execute: AsyncGeneratorFunction;
        }
    >;
    anglais?: { [name: string]: Array<string> };
    database?: Database;
    links?: EmbedBuilder[];
    tempsMotRandom?: {
        minute: number;
        heure: number;
    };
}
