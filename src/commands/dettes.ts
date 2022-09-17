import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ref, get, child } from "firebase/database";
import { dataDettesProcessing } from "../helpers/functions/dataDettesProcessing";
import { ClientExtend } from "../helpers/types/clientExtend";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dettes")
        .setDescription("Permet de voir les dettes actuelles des élèves."),

    async execute(interaction: ChatInputCommandInteraction) {
        const client: ClientExtend = interaction.client;
        if (!client.database)
            return await interaction.reply({
                content: "Je n'ai pas pu trouver ma base de données :/",
                ephemeral: true,
            });

        const Dettesref = ref(client.database);
        get(child(Dettesref, "dettes/")).then(async (snapshot) => {
            const embed = dataDettesProcessing(snapshot.val());

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        });
    },
};
