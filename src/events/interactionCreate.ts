import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
} from "discord.js";
import { handleButton } from "../helpers/handlers/button";
import { handleCommand } from "../helpers/handlers/command";
import { handleMenu } from "../helpers/handlers/menu";
import { handleModal } from "../helpers/handlers/modal";
import { ClientExtend } from "../helpers/types/ClientExtend";

module.exports = {
    name: "interactionCreate",
    async execute(
        client: ClientExtend,
        interaction:
            | ChatInputCommandInteraction
            | StringSelectMenuInteraction
            | ModalSubmitInteraction
            | ButtonInteraction
    ) {
        if (interaction.isCommand()) await handleCommand(client, interaction);
        else if (interaction.isButton())
            await handleButton(client, interaction);
        else if (interaction.isStringSelectMenu())
            await handleMenu(client, interaction);
        else if (interaction.isModalSubmit())
            await handleModal(client, interaction);
    },
};
