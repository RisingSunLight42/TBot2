import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    StringSelectMenuBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { ref, get, child } from "firebase/database";
import { ClientExtend } from "../helpers/types/clientExtend";
import { embedGenerator } from "../helpers/generators/embed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("liens")
        .setDescription("Permet d'avoir les liens utiles rapidement.")
        .addBooleanOption((option) =>
            option
                .setName("choix")
                .setDescription(
                    "Veux-tu avoir le choix sur les liens que tu souhaites voir ?"
                )
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const client: ClientExtend = interaction.client;
        if (!client.database)
            return await interaction.reply({
                content: "Je n'ai pas pu trouver ma base de données :/",
                ephemeral: true,
            });

        const arrEmbed: EmbedBuilder[] = [];
        const row =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("linksSelect")
                    .setPlaceholder("Aucun lien sélectionné")
            );
        const choix = interaction.options.getBoolean("choix", true);
        const Liensref = ref(client.database);
        const sites = (await get(child(Liensref, "liens/"))).val();
        for (const site of sites) {
            arrEmbed.push(
                embedGenerator({
                    title: site.nom,
                    color: site.couleur,
                    description: site.description,
                    url: site.lien,
                    thumbnail: site.image,
                })
            );

            row.components[0].addOptions({
                label: site.nom,
                description: `Lien pour le site ${site.nom}`,
                value: site.nom,
            });
        }

        client.links = arrEmbed;
        await interaction.reply({
            content: choix
                ? "Voici la liste des liens demandés !"
                : "Voici les liens demandés !",
            embeds: choix ? [] : arrEmbed,
            components: choix ? [row] : [],
            ephemeral: true,
        });
    },
};
