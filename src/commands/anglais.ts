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
import { ClientExtend } from "../helpers/types/clientExtend";
import { embedGenerator } from "../helpers/generators/embed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anglais")
        .setDescription("Permet d'avoir un mot aléatoire à traduire.")
        .addBooleanOption((option) =>
            option
                .setName("score")
                .setDescription(
                    "Permet de voir son score en anglais si activé !"
                )
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const client: ClientExtend = interaction.client;
        if (interaction.options.getBoolean("score", true) && client.database) {
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
        const mot =
            listeMotsAnglais[
                Math.floor(listeMotsAnglais.length * Math.random())
            ];
        const modal = new ModalBuilder()
            .setCustomId(`reponseAnglais&${client.anglais[mot]}`)
            .setTitle(`Traduit "${mot}" !`)
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("reponse")
                        .setRequired(true)
                        .setLabel("Traduction")
                        .setStyle(TextInputStyle.Short)
                )
            );
        return await interaction.showModal(modal);
    },
};
