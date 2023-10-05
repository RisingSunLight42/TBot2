import { StringSelectMenuInteraction } from "discord.js";
import { ref, child, remove } from "firebase/database";
import { ClientExtend } from "../helpers/types/ClientExtend";

module.exports = {
    name: "supprimerDettesSelect",
    async execute(
        client: ClientExtend,
        interaction: StringSelectMenuInteraction,
    ) {
        const message = await interaction.channel?.messages.fetch(
            interaction.customId.split("&")[1],
        );
        if (!client.database)
            return await message?.edit({
                content: "Je n'ai pas pu accéder à ma BDD :c",
            });

        const refDB = ref(client.database);
        await remove(child(refDB, `/dettes/${interaction.values[0]}`));

        await message?.delete();
        return interaction.reply({
            content: "La dette a bien été supprimée !",
            ephemeral: true,
        });
    },
};
