import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} from "discord.js";
import { ref, child, get } from "firebase/database";
import { ClientExtend } from "../helpers/types/ClientExtend";
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("supprimer")
        .setDescription("Permet de supprimer quelque chose à la BDD.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("dettes")
                .setDescription("Permet de supprimer une dette à la BDD.")
        ),

    async execute(
        client: ClientExtend,
        interaction: ChatInputCommandInteraction
    ) {
        const gestionnaireId = process.env.GESTIONNAIRE_ID;
        if (!gestionnaireId)
            return await interaction.reply({
                content:
                    "Je n'ai pas pu récupérer l'identifiant de mon développeur, je suis forcé de bloquer cette commande, désolé !",
                ephemeral: true,
            });

        const refDB = ref(client.database);
        const val = await (
            await get(child(refDB, `/dettes/${interaction.user.id}`))
        ).val();

        const message = await interaction.channel?.send({
            content: "Choisi l'élément à retirer !",
        });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`supprimerDettesSelect&${message?.id}`)
            .setPlaceholder("Rien n'a été sélectionné.");
        for (const key of Object.keys(val)) {
            selectMenu.addOptions({
                label: key,
                description: val[key],
                value: `${interaction.user.id}/${key}`,
            });
        }

        await message?.edit({
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    selectMenu
                ),
            ],
        });

        return await interaction.reply({
            content: "Le message pour faire ton choix a été envoyé !",
            ephemeral: true,
        });
    },
};
