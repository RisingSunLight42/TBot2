import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
} from "discord.js";
import { ClientExtend } from "../helpers/types/clientExtend";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anglais")
        .setDescription("Permet d'avoir un mot aléatoire à traduire."),

    async execute(interaction: ChatInputCommandInteraction) {
        const client: ClientExtend = interaction.client;
        if (!client.anglais)
            return await interaction.reply({
                content: "Je n'ai pas pu accéder à la liste des mots :/",
                ephemeral: true,
            });

        const listeMotsAnglais = Object.keys(client.anglais);
        const mot =
            listeMotsAnglais[
                Math.floor(listeMotsAnglais.length * Math.random())
            ];
        const modal = new ModalBuilder()
            .setCustomId(`reponseAnglais&${client.anglais[mot]}`)
            .setTitle(`Traduit "${mot}" !`)
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("reponse")
                        .setRequired(true)
                        .setLabel("Traduction")
                        .setStyle(TextInputStyle.Short)
                )
            );
        return await interaction.showModal(modal);
    },
};
