import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ref, get, child, set } from "firebase/database";
import { ClientExtend } from "../helpers/types/ClientExtend";
require("dotenv").config();

const gestionnaireID = process.env.GESTIONNAIRE_ID;

if (!gestionnaireID) throw new Error("L'ID du gestionnaire n'existe pas !");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gestion")
        .setDescription("Permet de gérer certains éléments du bot."),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id != gestionnaireID)
            return interaction.reply({
                content:
                    "Tu n'es pas mon développeur, tu n'as pas le droit de faire cette commande !",
                ephemeral: true,
            });
        const client: ClientExtend = interaction.client;
        if (!client.database)
            return await interaction.reply({
                content: "Je n'ai pas pu trouver ma base de données :/",
                ephemeral: true,
            });

        const refDB = ref(client.database);
        const val = (await get(child(refDB, "edtParam/"))).val();
        await set(child(refDB, "edtParam/"), !val);
        return await interaction.reply({
            content: `L'EdT a bien été ${!val ? "activé" : "désactivé"} !`,
            ephemeral: true,
        });
    },
};
