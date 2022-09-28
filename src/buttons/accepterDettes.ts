import { ButtonInteraction } from "discord.js";
import { child, ref, set } from "firebase/database";
import { ClientExtend } from "../helpers/types/clientExtend";

module.exports = {
    name: "accepterDettes",
    async execute(client: ClientExtend, interaction: ButtonInteraction) {
        if (!client.database)
            return await interaction.reply({
                content: "Je n'ai pas pu accéder à ma BDD :c",
                ephemeral: true,
            });
        const [, endetteur, endette, dette] = interaction.customId.split("&");
        const refDB = ref(client.database);
        const chemin = `dettes/${endetteur}/${endette}`;
        await set(child(refDB, chemin), dette);
        await interaction.update({ components: [] });
        return await interaction.followUp({
            content: "L'ajout a bien été réalisé !",
            ephemeral: true,
        });
    },
};
