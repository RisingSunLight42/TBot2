import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
} from "discord.js";
import { child, get, ref } from "firebase/database";
import { ClientExtend } from "../helpers/types/ClientExtend";
import { embedGenerator } from "../helpers/generators/embed";
import { randomArr } from "../helpers/functions/random";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anglais")
        .setDescription("Permet d'avoir un mot aléatoire à traduire.")
        .addBooleanOption((option) =>
            option
                .setName("score")
                .setDescription(
                    "Permet de voir son score en anglais si activé !",
                )
                .setRequired(true),
        ),

    async execute(
        client: ClientExtend,
        interaction: ChatInputCommandInteraction,
    ) {
        if (interaction.options.getBoolean("score", true)) {
            const refDB = ref(client.database);
            const val: { [name: string]: number } = await (
                await get(child(refDB, `statsAnglais/${interaction.user.id}`))
            ).val();
            const fieldsArr = Object.keys(val).map((key) => {
                return {
                    name: `${key[0].toUpperCase()}${key.slice(1)}${
                        val[key] > 1 ? "s" : ""
                    }`,
                    value: `${val[key]} mot${val[key] > 1 ? "s" : ""}`,
                };
            });
            return interaction.reply({
                embeds: [
                    embedGenerator({
                        title: "Tes stats en anglais !",
                        fields: fieldsArr,
                    }),
                ],
                ephemeral: true,
            });
        }
        if (!client.anglais)
            return await interaction.reply({
                content: "Je n'ai pas pu accéder à la liste des mots :/",
                ephemeral: true,
            });

        const listeMotsAnglais = Object.keys(client.anglais);
        const mot = randomArr(listeMotsAnglais);
        const anglais_ou_francais = Math.random() > 0.5;
        const modal = new ModalBuilder()
            .setCustomId(
                `reponseAnglais&${
                    anglais_ou_francais ? client.anglais[mot] : mot
                }`,
            )
            .setTitle(
                `Traduit en ${anglais_ou_francais ? "français" : "anglais"} "${
                    anglais_ou_francais ? mot : randomArr(client.anglais[mot])
                }" !`,
            )
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("reponse")
                        .setRequired(true)
                        .setLabel("Traduction")
                        .setStyle(TextInputStyle.Short),
                ),
            );
        return await interaction.showModal(modal);
    },
};
