import { ModalSubmitInteraction } from "discord.js";
import { child, ref, set, get } from "firebase/database";
import { ClientExtend } from "../helpers/types/ClientExtend";

module.exports = {
    name: "reponseAnglais",
    async execute(client: ClientExtend, interaction: ModalSubmitInteraction) {
        const reponse = interaction.fields
            .getTextInputValue("reponse")
            .trim()
            .toLowerCase();

        const reponseAttendue = interaction.customId.split("&")[1];

        if (client.database) {
            const refDB = ref(client.database);
            const chemin = `statsAnglais/${interaction.user.id}/${
                reponseAttendue.includes(reponse) ? "correct" : "incorrect"
            }`;
            const val = await (await get(child(refDB, chemin))).val();
            await set(child(refDB, chemin), val === null ? 1 : val + 1);
        }
        return await interaction.reply({
            content: reponseAttendue.includes(reponse)
                ? "Bonne réponse !"
                : `Raté ! La réponse attendue était : \n**${reponseAttendue.replace(
                      ",",
                      ", ",
                  )}**`,
            ephemeral: true,
        });
    },
};
