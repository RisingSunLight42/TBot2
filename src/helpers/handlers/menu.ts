import { SelectMenuInteraction } from "discord.js"; // Import des classes nécessaires pour les boutons
import { ClientExtend } from "../types/clientExtend";
require("dotenv").config();

const gestionnaireId = process.env.GESTIONNAIRE_ID;

if (!gestionnaireId) throw new Error("L'ID de Soutsu est manquant !");

export const handleMenu = async (
    client: ClientExtend,
    interaction: SelectMenuInteraction
) => {
    const menu = client.menus?.get(interaction.customId); // Récupère le menu exécuté

    if (!menu) return; // Il ne fait rien si la commande est vide

    try {
        menu.execute(client, interaction); // Essaye d'exécuter l'interaction
    } catch (error) {
        // S'il y a une erreur, renvoi un message d'erreur éphémère
        console.error(error);
        const soutsu = await client.users.fetch(gestionnaireId);
        await soutsu.send(
            `Une erreur a été rencontrée lors de l'utilisation du menu ${interaction.customId} par ${interaction.user.tag}.`
        );
        await interaction.reply({
            content:
                "Une erreur est survenue durant l'exécution du menu. Un rapport d'erreur a été envoyé à mon développeur !",
            ephemeral: true,
        });
    }
};
