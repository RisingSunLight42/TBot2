import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
    morseVersTexte,
    texteVersMorse,
} from "../helpers/constants/morseTranslation";
import { ClientExtend } from "../helpers/types/ClientExtend";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("traduction")
        .setDescription("Permet de traduire.")
        .addSubcommandGroup((subcommandgroup) =>
            subcommandgroup
                .setName("vers")
                .setDescription("Pour traduire vers l'option donnée.")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("morse")
                        .setDescription("Pour traduire du texte vers du morse.")
                        .addStringOption((option) =>
                            option
                                .setName("texte")
                                .setDescription("Le texte à traduire.")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("texte")
                        .setDescription("Pour traduire du morse vers du texte.")
                        .addStringOption((option) =>
                            option
                                .setName("texte")
                                .setDescription("Le texte à traduire.")
                                .setRequired(true)
                        )
                )
        ),

    async execute(
        client: ClientExtend,
        interaction: ChatInputCommandInteraction
    ) {
        let texteATraduire = interaction.options.getString("texte", true);
        let texteRetour = "";
        if (interaction.options.getSubcommand() === "morse") {
            texteATraduire = texteATraduire.replaceAll(/[_.]*/g, "");
            for (const caractere of texteATraduire) {
                if (Object.keys(texteVersMorse).includes(caractere)) {
                    texteRetour += texteVersMorse[caractere] + " ";
                } else {
                    texteRetour += caractere;
                }
            }
            texteRetour = "```" + texteRetour + "```";
        } else {
            texteATraduire = texteATraduire.replaceAll(/[^_. ]*/g, "");
            for (const mot of texteATraduire.split("  ")) {
                for (const caractere of mot.split(" ")) {
                    if (Object.keys(morseVersTexte).includes(caractere)) {
                        texteRetour += morseVersTexte[caractere];
                    } else {
                        texteRetour += caractere;
                    }
                }
                texteRetour += " ";
            }
        }
        await interaction.reply({
            content: texteRetour,
            ephemeral: true,
        });
    },
};
