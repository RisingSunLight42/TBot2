import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import linksJson from "../helpers/datas/link.json";
import { colors } from "../helpers/constants/colorsCode";

// Crée la commande en faisant une nouvelle commande Slash
module.exports = {
    data: new SlashCommandBuilder()
        .setName("liens")
        .setDescription("Permet d'avoir les liens utiles rapidement.")
        .addStringOption((option) =>
            option
                .setName("lien")
                .setDescription("Le lien que tu souhaites avoir")
                .addChoices(
                    { name: "Zimbra", value: "Zimbra" },
                    { name: "Léocarte", value: "Léocarte" },
                    { name: "Impression", value: "Impression" },
                    { name: "Unicloud", value: "Unicloud" },
                    { name: "E-Campus", value: "E-Campus" },
                    { name: "Wiki campus 3", value: "Wiki campus 3" },
                    { name: "Emploi du temps", value: "Emploi du temps" },
                    { name: "Site de Mr Anne", value: "Site de Mr Anne" },
                    { name: "Github du bot", value: "Github du bot" }
                )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const arrEmbed = [];
        const lien = interaction.options.getString("lien");
        for (const linkItem of linksJson.liens) {
            const embed = new EmbedBuilder()
                .setTitle(linkItem.nom)
                .setURL(linkItem.lien)
                .setColor(colors[linkItem.couleur])
                .setDescription(linkItem.description)
                .setThumbnail(linkItem.image);
            arrEmbed.push(embed);
        }

        await interaction.reply({
            content: lien
                ? "Voici le lien demandé !"
                : "Voici les liens demandés !",
            embeds: lien
                ? arrEmbed.filter((embed) => embed.data.title === lien)
                : arrEmbed,
            ephemeral: true,
        });
    },
};
