// Importe le nécessaire pour réaliser la commande
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchEdt } from "../helpers/functions/fetchEdt";
import { dataProcressing } from "../helpers/functions/dataProcessing";

// Crée la commande en faisant une nouvelle commande Slash
module.exports = {
    data: new SlashCommandBuilder()
        .setName("edt")
        .setDescription("Permet d'avoir l'edt")
        .addNumberOption((option) =>
            option
                .setName("classe")
                .setDescription("La classe dont tu veux l'emploi du temps")
                .addChoices(
                    { name: "TP1", value: 1177 },
                    { name: "TP2", value: 1179 },
                    { name: "TP3", value: 1185 },
                    { name: "TP4", value: 1186 },
                    { name: "TP5", value: 1189 },
                    { name: "TP6", value: 1191 }
                )
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName("jour")
                .setDescription(
                    "Quand par rapport à aujourd'hui tu veux voir l'emploi du temps (les week-ends n'existent pas !)"
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
        const edtDataAsked = await dataProcressing(edtData, jour, affichage);
        await interaction.reply({ content: "Pong !", ephemeral: true }); // Réponds Pong !
    },
};
