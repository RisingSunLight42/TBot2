// Import dependencies
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { readdirSync } from "fs";
import { ClientExtend } from "./helpers/types/clientExtend";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "./helpers/constants/firebaseConfig";
import path from "path";
require("dotenv").config();

const clientToken = process.env.CLIENT_TOKEN;

const client: ClientExtend = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
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

//* Fetch buttons
client.buttons = new Collection();
const buttonFiles = readdirSync(path.join(__dirname, ".", "buttons")).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
);

for (const file of buttonFiles) {
    const button = require(`./buttons/${file}`);
    client.buttons.set(button.name, button);
}

//* Fetch menus
client.menus = new Collection();
const menuFiles = readdirSync(path.join(__dirname, ".", "menus")).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
);

for (const file of menuFiles) {
    const menu = require(`./menus/${file}`);
    client.menus.set(menu.name, menu);
}

//* Fetch modals
client.modals = new Collection();
const modalFiles = readdirSync(path.join(__dirname, ".", "modals")).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
);

for (const file of modalFiles) {
    const modal = require(`./modals/${file}`);
    client.modals.set(modal.name, modal);
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

client.database = getDatabase(initializeApp(firebaseConfig));

client.login(clientToken);
