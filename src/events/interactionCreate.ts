import { ChatInputCommandInteraction, SelectMenuInteraction } from "discord.js";
import { handleCommand } from "../helpers/handlers/command";
import { handleMenu } from "../helpers/handlers/menu";

module.exports = {
    name: "interactionCreate",
    async execute(
        interaction: ChatInputCommandInteraction | SelectMenuInteraction
    ) {
        if (interaction.isCommand())
            await handleCommand(interaction.client, interaction);
        else if (interaction.isSelectMenu())
            await handleMenu(interaction.client, interaction);
    },
};
