import { StringSelectMenuInteraction } from "discord.js";
import { ClientExtend } from "../helpers/types/clientExtend";

module.exports = {
    name: "linksSelect",
    async execute(
        client: ClientExtend,
        interaction: StringSelectMenuInteraction
    ) {
        console.log("a");
        if (!client.links)
            return await interaction.reply({
                content: "Je n'ai pas pu récupérer les liens :/",
                ephemeral: true,
            });
        await interaction.reply({
            embeds: client.links.filter(
                (embed) => embed.data.title === interaction.values[0]
            ),
            ephemeral: true,
        });
    },
};
