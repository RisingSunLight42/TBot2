import { ChatInputCommandInteraction } from "discord.js";

import { handleCommand } from "../helpers/handlers/command";

module.exports = {
    name: "interactionCreate",
    async execute(interaction: ChatInputCommandInteraction) {
        //* Selection de l'handler suivant
        if (interaction.isCommand())
            await handleCommand(interaction.client, interaction);
    },
};
