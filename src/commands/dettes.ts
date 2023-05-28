import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ref, get, child } from "firebase/database";
import { dataDettesProcessing } from "../helpers/functions/dataDettesProcessing";
import { ClientExtend } from "../helpers/types/ClientExtend";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dettes")
        .setDescription("Permet de voir les dettes actuelles des élèves."),

    async execute(
        client: ClientExtend,
        interaction: ChatInputCommandInteraction
    ) {
        const Dettesref = ref(client.database);
        const val = (await get(child(Dettesref, "dettes/"))).val();
        const embed = await dataDettesProcessing(client, val);
        return await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
