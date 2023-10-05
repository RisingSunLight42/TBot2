import { StringSelectMenuInteraction } from "discord.js";
import { ClientExtend } from "../types/ClientExtend";
require("dotenv").config();

const gestionnaireId = process.env.GESTIONNAIRE_ID;

if (!gestionnaireId) throw new Error("L'ID de Soutsu est manquant !");

export const handleMenu = async (
    client: ClientExtend,
    interaction: StringSelectMenuInteraction,
) => {
    const nom_menu = interaction.customId.includes("&")
        ? interaction.customId.split("&")[0]
        : interaction.customId;
    const menu = client.menus?.get(nom_menu);

    if (!menu) return;

    try {
        menu.execute(client, interaction);
    } catch (error) {
        console.error(error);
        const soutsu = await client.users.fetch(gestionnaireId);
        await soutsu.send(
            `Une erreur a été rencontrée lors de l'utilisation du menu ${interaction.customId} par ${interaction.user.tag}.`,
        );
        await interaction.reply({
            content:
                "Une erreur est survenue durant l'exécution du menu. Un rapport d'erreur a été envoyé à mon développeur !",
            ephemeral: true,
        });
    }
};
