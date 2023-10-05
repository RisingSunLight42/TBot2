import { ChannelType, ChatInputCommandInteraction } from "discord.js";
import { ClientExtend } from "../types/ClientExtend";
import {
    permissionsObject,
    permissionsSubcommandObject,
} from "../constants/permissionsObjects";
import { permissionResolvableObject } from "../constants/permissionsResolvable";
require("dotenv").config();

const gestionnaireId = process.env.GESTIONNAIRE_ID;

if (!gestionnaireId) throw new Error("L'ID du gestionnaire est manquant !");

export const handleCommand = async (
    client: ClientExtend,
    interaction: ChatInputCommandInteraction,
) => {
    const { commandName, options, channel, memberPermissions, user } =
        interaction;
    const command = client.commands.get(commandName);

    if (!command) return;
    if (channel?.type === ChannelType.DM && commandName != "edt")
        return await interaction.reply({
            content:
                "Je ne peux pour l'instant pas réaliser de commandes en MP !",
            ephemeral: true,
        });

    //* Vérifie si l'utilisateur a les droits d'admin pour les commandes données
    for (const [perm, liste_commandes] of Object.entries(permissionsObject)) {
        if (
            !memberPermissions?.has(permissionResolvableObject[perm]) &&
            liste_commandes.includes(commandName) &&
            (Object.keys(permissionsSubcommandObject).includes(commandName)
                ? permissionsSubcommandObject[commandName].includes(
                      //* Les cas particuliers peuvent fonctionner via SubcommandGroup ou Subcommand
                      (options.getSubcommandGroup()
                          ? options.getSubcommandGroup()
                          : options.getSubcommand()) ?? "STRING_GUARD",
                  )
                : true)
        )
            return interaction.reply({
                content: `Tu n'as pas l'autorisation requise (${perm}) pour exécuter cette commande !`,
                ephemeral: true,
            });
    }

    //* Exécution de la commande, avec catch en cas d'erreur
    try {
        command.execute(client, interaction);
    } catch (error) {
        console.error(error);
        const gestionnaire = await client.users.fetch(gestionnaireId);
        await gestionnaire.send(
            `Une erreur a été rencontrée lors de l'utilisation de la commande ${commandName} par ${user.tag}.`,
        );
        await interaction.reply({
            content:
                "Une erreur est survenue durant l'exécution de la commande. Un rapport d'erreur a été envoyé à mon développeur !",
            ephemeral: true,
        });
    }
};
