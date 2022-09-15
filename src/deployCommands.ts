import { readdirSync } from "fs";
import path from "path";
import { REST } from "@discordjs/rest";
import { Routes, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
require("dotenv").config();

// Initialise les variables d'environnement
const clientId = process.env.CLIENT_ID;
const clientToken = process.env.CLIENT_TOKEN;
const guildGestionId = process.env.GUILD_GESTION_ID;

if (!clientId || !clientToken || !guildGestionId)
    throw new Error("One of the env variables is undefined.");

export const recupFichier = () => {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const commandFiles = readdirSync(
        path.join(__dirname, ".", "commands")
    ).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
    return commands;
};

const rest = new REST({ version: "10" }).setToken(clientToken);

export const deployCommands = async (
    commands: RESTPostAPIApplicationCommandsJSONBody[],
    global: boolean
) => {
    try {
        await rest.put(
            global
                ? Routes.applicationCommands(clientId)
                : Routes.applicationGuildCommands(clientId, guildGestionId),
            {
                body: commands,
            }
        );
        console.log(
            `🧪 Les commandes (/) ${
                global ? "globales" : "du serveur de gestion"
            } ont été enregistrées.`
        );
    } catch (error) {
        console.error(error);
    }
};
