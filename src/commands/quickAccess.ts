import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { ref, get, child } from "firebase/database";
import { ClientExtend } from "../helpers/types/clientExtend";
import { embedGenerator } from "../helpers/generators/embed";

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
                    { name: "Github du bot", value: "Github du bot" },
                    {
                        name: "Planning des contrôles",
                        value: "Planning des contrôles",
                    }
                )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const client: ClientExtend = interaction.client;
        if (!client.database)
            return await interaction.reply({
                content: "Je n'ai pas pu trouver ma base de données :/",
                ephemeral: true,
            });

        const arrEmbed: EmbedBuilder[] = [];
        const lien = interaction.options.getString("lien");
        const Liensref = ref(client.database);
        get(child(Liensref, "liens/")).then(async (snapshot) => {
            for (const site of snapshot.val())
                arrEmbed.push(
                    embedGenerator({
                        title: site.nom,
                        color: site.couleur,
                        description: site.description,
                        url: site.lien,
                        thumbnail: site.image,
                    })
                );
            await interaction.reply({
                content: lien
                    ? "Voici le lien demandé !"
                    : "Voici les liens demandés !",
                embeds: lien
                    ? arrEmbed.filter((embed) => embed.data.title === lien)
                    : arrEmbed,
                ephemeral: true,
            });
        });
    },
};
