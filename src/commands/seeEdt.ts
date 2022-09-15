// Importe le nécessaire pour réaliser la commande
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import { fetchEdt } from "../helpers/functions/fetchEdt";
import { dataProcessing } from "../helpers/functions/dataProcessing";
import { staticDay } from "../helpers/constants/daysCode";
import { staticMonth } from "../helpers/constants/monthsCode";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("edt")
        .setDescription("Permet d'avoir l'edt")
        .addNumberOption((option) =>
            option
                .setName("classe")
                .setDescription("La classe dont tu veux l'emploi du temps")
                .addChoices(
                    { name: "TP1 (TP1.1)", value: 1177 },
                    { name: "TP2 (TP1.2)", value: 1179 },
                    { name: "TP3 (TP2.1)", value: 1185 },
                    { name: "TP4 (TP2.2)", value: 1186 },
                    { name: "TP5 (TP3.1)", value: 1189 },
                    { name: "TP6 (TP3.2)", value: 1191 }
                )
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName("jour")
                .setDescription(
                    "La semaine ne prend pas en compte les W-E, donc aujourd'hui en weed-end donnera Lundi !"
                )
                .addChoices(
                    { name: "Aujourd'hui", value: 0 },
                    { name: "+ 1 jour", value: 1 },
                    { name: "+ 2 jours", value: 2 },
                    { name: "+ 3 jours", value: 3 },
                    { name: "+ 4 jours", value: 4 },
                    { name: "+ 5 jours", value: 5 }
                )
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("affichage")
                .setDescription(
                    "Dois-je afficher les jours intermédiaires ou pas ?"
                )
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const classe = interaction.options.getNumber("classe", true);
        const jour = interaction.options.getNumber("jour", true);
        const affichage = interaction.options.getBoolean("affichage", true);
        const edtData = await fetchEdt(classe);
        const edtDataAsked = await dataProcessing(edtData, jour, affichage);

        const arrEmbed = [];
        for (const jourData of edtDataAsked) {
            const numJour = parseInt(jourData[0].jour);
            const numMonth = jourData[0].mois;
            const year = jourData[0].annee;
            const day = new Date(
                `${year}-${numMonth}-${numJour} 12:00:00`
            ).getDay();
            const embed = new EmbedBuilder().setTitle(
                `Emploi du Temps du ${staticDay[day]} ${numJour} ${staticMonth[numMonth]} ${year}`
            );
            for (const heureData of jourData) {
                embed.addFields({
                    name: `${heureData.hDebut} - ${heureData.hFin}`,
                    value: `${heureData.cours}\n${heureData.enseignant}\nSalle : ${heureData.salle}`,
                });
            }
            arrEmbed.push(embed);
        }

        await interaction.reply({
            content: "Voici l'emploi du temps demandé !",
            embeds: arrEmbed,
            ephemeral:
                interaction.channel?.isDMBased() === undefined ||
                interaction.channel?.isDMBased()
                    ? false
                    : true,
        });
    },
};
