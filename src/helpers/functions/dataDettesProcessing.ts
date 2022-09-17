import { EmbedBuilder } from "discord.js";

export const dataDettesProcessing = (data: {
    [name: string]: { [name: string]: string };
}) => {
    const embed = new EmbedBuilder().setTitle("Les DETTES du jour");
    for (const key in data) {
        let textField: string = "";
        for (const textKey of Object.keys(data[key])) {
            textField += `${textKey} : ${data[key][textKey]}\n`;
        }
        embed.addFields({
            name: `Pour ${key}`,
            value: textField,
        });
    }
    return embed;
};
