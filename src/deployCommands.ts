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
    const commandsGestion = [];
    const commandFiles = readdirSync(
        path.join(__dirname, ".", "commands")
    ).filter((file) => file.endsWith(".js") || file.endsWith(".ts")); // Récupère les fichiers .js des commandes se situant dans le dossier commands

    for (const file of commandFiles) {
        // Parcours la liste de fichiers
        const command = require(`./commands/${file}`); // Récupère le fichier dans la variable command
        commandsGestion.push(command.data.toJSON()); // Met la commande en format JSON dans la liste des commandes du serveur de gestion
    }
    return commandsGestion;
};

const rest = new REST({ version: "10" }).setToken(clientToken); // Récupère l'API Discord

export const deployGestion = async (
    commandsGestion: RESTPostAPIApplicationCommandsJSONBody[]
) => {
    try {
        // Envoie les commandes (/) du serveur de gestion à l'API pour les utiliser
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildGestionId),
            {
                body: commandsGestion,
            }
        );
        console.log(
            "🧪 Les commandes (/) du serveur de gestion ont été enregistrées."
        );
    } catch (error) {
        console.error(error);
    }
};
