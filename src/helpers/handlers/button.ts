import { ButtonInteraction } from "discord.js";
import { ClientExtend } from "../types/clientExtend";
require("dotenv").config();

const gestionnaireId = process.env.GESTIONNAIRE_ID;

if (!gestionnaireId) throw new Error("L'ID de Soutsu est manquant !");

export const handleButton = async (
    client: ClientExtend,
    interaction: ButtonInteraction
) => {
    const nom_button = interaction.customId.includes("&")
        ? interaction.customId.split("&")[0]
        : interaction.customId;
    const button = client.buttons?.get(nom_button);

    if (!button) return;

    try {
        button.execute(client, interaction);
    } catch (error) {
        console.error(error);
        const soutsu = await client.users.fetch(gestionnaireId);
        await soutsu.send(
            `Une erreur a été rencontrée lors de l'utilisation du bouton ${interaction.customId} par ${interaction.user.tag}.`
        );
        await interaction.reply({
            content:
                "Une erreur est survenue durant l'exécution du bouton. Un rapport d'erreur a été envoyé à mon développeur !",
            ephemeral: true,
        });
    }
};
