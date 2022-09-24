import { ModalSubmitInteraction } from "discord.js";
import { ClientExtend } from "../helpers/types/clientExtend";

module.exports = {
    name: "reponseAnglais",
    async execute(client: ClientExtend, interaction: ModalSubmitInteraction) {
        const reponse = interaction.fields
            .getTextInputValue("reponse")
            .trim()
            .toLowerCase();

        const reponseAttendue = interaction.customId.split("&")[1];
        return await interaction.reply({
            content:
                reponseAttendue === reponse
                    ? "Bonne réponse !"
                    : `Raté ! La réponse attendue était : \n**${reponseAttendue}**`,
            ephemeral: true,
        });
    },
};
