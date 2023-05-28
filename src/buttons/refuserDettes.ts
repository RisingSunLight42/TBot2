import { ButtonInteraction } from "discord.js";
import { ClientExtend } from "../helpers/types/ClientExtend";

module.exports = {
    name: "refuserDettes",
    async execute(client: ClientExtend, interaction: ButtonInteraction) {
        await interaction.update({ components: [] });
        return await interaction.followUp({
            content: "L'ajout a bien été refusé !",
            ephemeral: true,
        });
    },
};
