import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { ref, get, child } from "firebase/database";
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
            const data: { [name: string]: { [name: string]: string } } =
                snapshot.val();
            const embed = new EmbedBuilder().setTitle("Les DETTES");
            for (const key in data) {
                let textField: string = "";
                for (const textKey of Object.keys(data[key])) {
                    textField += `${textKey} : ${data[key][textKey]}\n`;
                }
                embed.addFields({ name: `Pour ${key}`, value: textField });
            }

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        });
    },
};
