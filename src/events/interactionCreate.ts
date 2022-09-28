import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    SelectMenuInteraction,
} from "discord.js";
import { handleButton } from "../helpers/handlers/button";
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
            | ButtonInteraction
    ) {
        if (interaction.isCommand())
            await handleCommand(interaction.client, interaction);
        else if (interaction.isButton())
            await handleButton(interaction.client, interaction);
        else if (interaction.isSelectMenu())
            await handleMenu(interaction.client, interaction);
        else if (interaction.isModalSubmit())
            await handleModal(interaction.client, interaction);
    },
};
