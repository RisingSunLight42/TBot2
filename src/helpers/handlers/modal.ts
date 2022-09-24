import { ModalSubmitInteraction } from "discord.js";
import { ClientExtend } from "../types/clientExtend";
require("dotenv").config();

const gestionnaireId = process.env.GESTIONNAIRE_ID;

if (!gestionnaireId) throw new Error("L'ID du gestionnaire est manquant !");

/**
 * Permet de gérer les boutons du bot
 * @param {Client} client
 * @param {ModalSubmitInteraction} interaction
 */
export const handleModal = async (
    client: ClientExtend,
    interaction: ModalSubmitInteraction
) => {
    const nom_modal = interaction.customId.includes("&")
        ? interaction.customId.split("&")[0]
        : interaction.customId;
    const modal = client.modals?.get(nom_modal);

    if (!modal) return;

    try {
        modal.execute(client, interaction);
    } catch (error) {
        console.error(error);
        const gestionnaire = await client.users.fetch(gestionnaireId);
        await gestionnaire.send(
            `Une erreur a été rencontrée lors de l'utilisation du modal ${interaction.customId} par ${interaction.user.tag}.`
        );
        await interaction.reply({
            content:
                "Une erreur est survenue durant l'exécution du modal. Un rapport d'erreur a été envoyé à mon développeur !",
            ephemeral: true,
        });
    }
};
