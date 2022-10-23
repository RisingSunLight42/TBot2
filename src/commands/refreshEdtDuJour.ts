import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { edtDuJour } from "../helpers/functions/edtDuJour";
import { ClientExtend } from "../helpers/types/clientExtend";
const gestionnaireID = process.env.GESTIONNAIRE_ID;

if (!gestionnaireID) throw new Error("L'ID du gestionnaire est manquant !");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("refreshEdt")
        .setDescription("Permet de refresh l'EdT du jour.")
        .addNumberOption((option) =>
            option
                .setName("offset")
                .setMinValue(0)
                .setMaxValue(1)
                .setDescription("L'offset à appliquer au refresh")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id != gestionnaireID)
            return await interaction.reply({
                content:
                    "Cette commande est réservée à mon développeur, tu ne peux pas l'utiliser !",
                ephemeral: true,
            });
        const client: ClientExtend = interaction.client;
        await edtDuJour(
            client,
            interaction.options.getNumber("offset", true),
            true
        );
        await interaction.reply({
            content: "Refresh avec succès !",
            ephemeral: true,
        });
    },
};
