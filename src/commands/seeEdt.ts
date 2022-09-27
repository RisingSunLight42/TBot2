// Importe le nécessaire pour réaliser la commande
import {
    ChannelType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import { fetchEdt } from "../helpers/functions/fetchEdt";
import { dataEdtProcessing } from "../helpers/functions/dataEdtProcessing";
import { staticDay } from "../helpers/constants/daysCode";
import { staticMonth } from "../helpers/constants/monthsCode";
import { embedGenerator } from "../helpers/generators/embed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("edt")
        .setDescription("Permet d'avoir l'edt")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("classe")
                .setDescription("Permet d'avoir l'EdT de la classe.")
                .addNumberOption((option) =>
                    option
                        .setName("classe")
                        .setDescription(
                            "La classe dont tu veux l'emploi du temps"
                        )
                        .addChoices(
                            { name: "TP2.1", value: 1185 },
                            { name: "TP2.2", value: 1186 }
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
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("salle")
                .setDescription("Permet d'avoir l'EdT d'une salle.")
                .addNumberOption((option) =>
                    option
                        .setName("salle")
                        .setDescription(
                            "La salle dont tu veux l'emploi du temps"
                        )
                        .addChoices(
                            { name: "1106", value: 38541 },
                            { name: "1109", value: 37355 },
                            { name: "1110", value: 39548 },
                            { name: "2124", value: 38756 },
                            { name: "2127", value: 39491 },
                            { name: "2129", value: 38113 },
                            { name: "2234", value: 39052 },
                            { name: "2235", value: 37590 },
                            { name: "2236", value: 38484 },
                            { name: "2237", value: 39005 },
                            { name: "2240", value: 140414 },
                            { name: "Labo de langues", value: 38713 },
                            { name: "Labo multimédia", value: 24132 }
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
                )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const opt = interaction.options;
        const infoEdt =
            opt.getSubcommand() === "classe"
                ? opt.getNumber("classe", true)
                : opt.getNumber("salle", true);
        const jour = opt.getNumber("jour", true);
        const affichage = opt.getBoolean("affichage", true);
        const edtData = await fetchEdt(infoEdt);
        const edtDataAsked = await dataEdtProcessing(edtData, jour, affichage);

        const arrEmbed = [];
        for (const jourData of edtDataAsked) {
            if (jourData.length != 0) {
                const numJour = parseInt(jourData[0].jour);
                const numMonth = jourData[0].mois;
                const year = jourData[0].annee;
                const day = new Date(
                    `${year}-${numMonth}-${numJour} 12:00:00`
                ).getDay();
                const arrFields = [];
                for (const heureData of jourData) {
                    arrFields.push({
                        name: `${heureData.hDebut} - ${heureData.hFin}`,
                        value: `${heureData.cours}\n${heureData.enseignant}\nSalle : ${heureData.salle}`,
                    });
                }
                arrEmbed.push(
                    embedGenerator({
                        title: `Emploi du Temps du ${staticDay[day]} ${numJour} ${staticMonth[numMonth]} ${year}`,
                        fields: arrFields,
                    })
                );
            }
        }

        await interaction.reply({
            content: `Voici l'emploi du temps demandé pour la ${opt.getSubcommand()} demandée !`,
            embeds: arrEmbed,
            ephemeral:
                interaction.channel?.type === ChannelType.DM ||
                interaction.channel?.type === undefined
                    ? false
                    : true,
        });
    },
};
