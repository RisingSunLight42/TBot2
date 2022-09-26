import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ref, set, child, get } from "firebase/database";
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
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("liens")
                .setDescription("Permet d'ajouter des mots à la BDD")
                .addStringOption((option) =>
                    option
                        .setName("couleur")
                        .setDescription("La couleur du site.")
                        .addChoices(
                            { name: "Default", value: "Default" },
                            { name: "DarkBlue", value: "DarkBlue" },
                            { name: "DarkPurple", value: "DarkPurple" },
                            { name: "Purple", value: "Purple" },
                            {
                                name: "LuminousVividPink",
                                value: "LuminousVividPink",
                            },
                            { name: "Red", value: "Red" },
                            { name: "Orange", value: "Orange" },
                            { name: "Yellow", value: "Yellow" },
                            { name: "Green", value: "Green" }
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("description")
                        .setDescription("La description du site.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("image")
                        .setDescription("L'image du site.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("lien")
                        .setDescription("Le lien du site.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("nom")
                        .setDescription("Le nom du site.")
                        .setRequired(true)
                )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const client: ClientExtend = interaction.client;
        const opt = interaction.options;
        const gestionnaireId = process.env.GESTIONNAIRE_ID;
        if (!client.database)
            return await interaction.reply({
                content: "Je n'ai pas pu accéder à ma BDD :c",
                ephemeral: true,
            });
        if (
            gestionnaireId != interaction.user.id &&
            opt.getSubcommand() != "dettes"
        )
            return await interaction.reply({
                content:
                    "OH ! T'es pas mon dév' toi, tu peux pas faire cette commande.",
                ephemeral: true,
            });
        const refDB = ref(client.database);
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
                const chemin = `anglais/${opt.getString("original", true)}`;
                await set(
                    child(refDB, chemin),
                    opt.getString("traduction", true)
                );
                break;
            }
            case "liens": {
                const val = await (await get(child(refDB, "liens/"))).val();
                await set(child(refDB, `liens/${val.length}`), {
                    couleur: opt.getString("couleur", true),
                    description: opt.getString("description", true),
                    image: opt.getString("image", true),
                    lien: opt.getString("lien", true),
                    nom: opt.getString("nom", true),
                });
                break;
            }
        }
        return await interaction.reply({
            content: "L'ajout à la BDD a bien été réalisé !",
            ephemeral: true,
        });
    },
};
