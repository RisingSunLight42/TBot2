import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import { ref, set, child, get } from "firebase/database";
import { ClientExtend } from "../helpers/types/ClientExtend";
import { staticMonthDay } from "../helpers/constants/monthsDay";
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
                        .setName("endette")
                        .setDescription("Celui qui doit être endetté.")
                        .setRequired(true),
                )
                .addStringOption((option) =>
                    option
                        .setName("dette")
                        .setDescription("Le détail de la dette.")
                        .setRequired(true),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("anglais")
                .setDescription("Permet d'ajouter des mots à la BDD")
                .addStringOption((option) =>
                    option
                        .setName("original")
                        .setDescription("Le mot original en anglais.")
                        .setRequired(true),
                )
                .addStringOption((option) =>
                    option
                        .setName("traduction")
                        .setDescription("Sa traduction.")
                        .setRequired(true),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("anniversaire")
                .setDescription("Permet d'ajouter son anniversaire.")
                .addNumberOption((option) =>
                    option
                        .setName("jour")
                        .setDescription("Le jour de ton anniversaire.")
                        .setMinValue(1)
                        .setMaxValue(31)
                        .setRequired(true),
                )
                .addNumberOption((option) =>
                    option
                        .setName("mois")
                        .setDescription("Le mois de ton anniversaire.")
                        .setMinValue(1)
                        .setMaxValue(12)
                        .setRequired(true),
                ),
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
                            { name: "Green", value: "Green" },
                        )
                        .setRequired(true),
                )
                .addStringOption((option) =>
                    option
                        .setName("description")
                        .setDescription("La description du site.")
                        .setRequired(true),
                )
                .addStringOption((option) =>
                    option
                        .setName("image")
                        .setDescription("L'image du site.")
                        .setRequired(true),
                )
                .addStringOption((option) =>
                    option
                        .setName("lien")
                        .setDescription("Le lien du site.")
                        .setRequired(true),
                )
                .addStringOption((option) =>
                    option
                        .setName("nom")
                        .setDescription("Le nom du site.")
                        .setRequired(true),
                ),
        ),

    async execute(
        client: ClientExtend,
        interaction: ChatInputCommandInteraction,
    ) {
        const opt = interaction.options;
        const gestionnaireId = process.env.GESTIONNAIRE_ID;
        if (!gestionnaireId)
            return await interaction.reply({
                content:
                    "Je n'ai pas pu récupérer l'identifiant de mon développeur, je suis forcé de bloquer cette commande, désolé !",
                ephemeral: true,
            });
        if (
            gestionnaireId != interaction.user.id &&
            !["dettes", "anniversaire"].includes(opt.getSubcommand())
        )
            return await interaction.reply({
                content:
                    "OH ! T'es pas mon dév' toi, tu peux pas faire cette commande.",
                ephemeral: true,
            });
        const refDB = ref(client.database);
        switch (opt.getSubcommand()) {
            case "dettes": {
                const endetteurId = interaction.user.id;
                const endette = opt.getString("endette", true);
                const dette = opt.getString("dette", true);
                if (interaction.user.id === gestionnaireId) {
                    const chemin = `dettes/${endetteurId}/${endette}`;
                    await set(child(refDB, chemin), dette);
                    return await interaction.reply({
                        content: "Ajout bien réalisé !",
                        ephemeral: true,
                    });
                }
                const gestionnaireUser = await interaction.client.users.fetch(
                    gestionnaireId,
                );
                await gestionnaireUser.send({
                    content:
                        `<@${interaction.user.id}> veut ajouter une dette !\n` +
                        `<@${endetteurId}> endette ${endette}, qui doit : ${dette}`,
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setLabel("Accepter")
                                .setCustomId(
                                    `accepterDettes&${endetteurId}&${endette}&${dette}`,
                                )
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setLabel("Refuser")
                                .setCustomId("refuserDettes")
                                .setStyle(ButtonStyle.Danger),
                        ),
                    ],
                });
                return interaction.reply({
                    content:
                        "L'enregistrement sera effectué après validation par mon développeur !",
                    ephemeral: true,
                });
                break;
            }
            case "anglais": {
                const chemin = `anglais/${opt.getString("original", true)}`;
                const val = await (await get(child(refDB, chemin))).val();
                await set(
                    child(refDB, chemin + `/${val ? val.length : 0}`),
                    opt.getString("traduction", true),
                );
                break;
            }
            case "liens": {
                const val = await (await get(child(refDB, "liens/"))).val();
                await set(
                    child(refDB, `liens/${val.length ? val.length : 0}`),
                    {
                        couleur: opt.getString("couleur", true),
                        description: opt.getString("description", true),
                        image: opt.getString("image", true),
                        lien: opt.getString("lien", true),
                        nom: opt.getString("nom", true),
                    },
                );
                break;
            }
            case "anniversaire": {
                const jour = opt.getNumber("jour", true);
                const mois = opt.getNumber("mois", true);
                if (staticMonthDay[mois < 10 ? `0${mois}` : `${mois}`] < jour)
                    return await interaction.reply({
                        content:
                            "Le jour que tu as donné est trop grand par rapport au mois ! Fait attention.",
                        ephemeral: true,
                    });
                const chemin = `anniversaire/${interaction.user.id}`;
                await set(child(refDB, chemin), {
                    jour,
                    mois,
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
