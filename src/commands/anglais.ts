import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
} from "discord.js";
import { ref, get, child } from "firebase/database";
import { ClientExtend } from "../helpers/types/clientExtend";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anglais")
        .setDescription("Permet d'avoir un mot aléatoire à traduire."),

    async execute(interaction: ChatInputCommandInteraction) {
        const client: ClientExtend = interaction.client;
        if (!client.database)
            return await interaction.reply({
                content: "Je n'ai pas pu trouver ma base de données :/",
                ephemeral: true,
            });

        const refDB = ref(client.database);
        get(child(refDB, "anglais/")).then(async (snapshot) => {
            const objetMots: { [name: string]: string } = await snapshot.val();
            const listeMotsAnglais = Object.keys(objetMots);
            const mot =
                listeMotsAnglais[
                    Math.floor(listeMotsAnglais.length * Math.random())
                ];
            const modal = new ModalBuilder()
                .setCustomId(`reponseAnglais&${objetMots[mot]}`)
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
        });
    },
};
