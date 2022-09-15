// Import dependencies
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { readdirSync } from "fs";
import { ClientExtend } from "./helpers/types/clientExtend";
import path from "path";
require("dotenv").config();

const clientToken = process.env.CLIENT_TOKEN;

const client: ClientExtend = new Client({
    intents: [GatewayIntentBits.Guilds],
});

//* Fetch commands
client.commands = new Collection();
const commandFiles = readdirSync(path.join(__dirname, ".", "commands")).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
);

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

//* Fetch events
const eventFiles = readdirSync(path.join(__dirname, ".", "events")).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
);

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(clientToken);
