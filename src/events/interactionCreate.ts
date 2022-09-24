import {
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    SelectMenuInteraction,
} from "discord.js";
import { handleCommand } from "../helpers/handlers/command";
import { handleMenu } from "../helpers/handlers/menu";
import { handleModal } from "../helpers/handlers/modal";

module.exports = {
    name: "interactionCreate",
    async execute(
        interaction:
            | ChatInputCommandInteraction
            | SelectMenuInteraction
            | ModalSubmitInteraction
    ) {
        if (interaction.isCommand())
            await handleCommand(interaction.client, interaction);
        else if (interaction.isSelectMenu())
            await handleMenu(interaction.client, interaction);
        else if (interaction.isModalSubmit())
            await handleModal(interaction.client, interaction);
    },
};
