import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ref, set, child } from "firebase/database";
import { ClientExtend } from "../helpers/types/clientExtend";
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ajout")
        .setDescription("Permet d'ajouter quelque chose à la BDD.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("dettes")
                .setDescription("Permet d'ajouter des dettes à la BDD")
                .addStringOption((option) =>
                    option
                        .setName("endetteur")
                        .setDescription("Celui à qui on doit la dette.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("endette")
                        .setDescription("Celui qui doit être endetté.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("dette")
                        .setDescription("Le détail de la dette.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("anglais")
                .setDescription("Permet d'ajouter des mots à la BDD")
                .addStringOption((option) =>
                    option
                        .setName("original")
                        .setDescription("Le mot original en anglais.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("traduction")
                        .setDescription("Sa traduction.")
                        .setRequired(true)
                )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const client: ClientExtend = interaction.client;
        if (!client.database)
            return await interaction.reply({
                content: "Je n'ai pas pu accéder à ma BDD :c",
                ephemeral: true,
            });
        const refDB = ref(client.database);
        const opt = interaction.options;
        switch (opt.getSubcommand()) {
            case "dettes": {
                const chemin = `dettes/${opt.getString(
                    "endetteur",
                    true
                )}/${opt.getString("endette", true)}`;
                await set(child(refDB, chemin), opt.getString("dette", true));
                break;
            }
            case "anglais": {
                const gestionnaireId = process.env.GESTIONNAIRE_ID;
                if (gestionnaireId != interaction.user.id)
                    return await interaction.reply({
                        content:
                            "OH ! T'es pas mon dév tout, tu peux pas faire cette commande.",
                        ephemeral: true,
                    });
                const chemin = `anglais/${opt.getString("original", true)}`;
                await set(
                    child(refDB, chemin),
                    opt.getString("traduction", true)
                );
                break;
            }
        }
        return await interaction.reply({
            content: "L'ajout à la BDD a bien été réalisé !",
            ephemeral: true,
        });
    },
};
