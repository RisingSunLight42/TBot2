import { EmbedBuilder } from "discord.js";
import { colors } from "../constants/colorsCode";

export const embedGenerator = (data: {
    title: string;
    color?: string;
    url?: string;
    description?: string;
    thumbnail?: string;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
    image?: string;
    footer?: { text: string; iconURL?: string };
}) => {
    const { title, color, url, description, thumbnail, fields, image, footer } =
        data;
    const embed = new EmbedBuilder().setTitle(title);
    if (color) embed.setColor(colors[color]);
    if (url) embed.setURL(url);
    if (description) embed.setDescription(description);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields) for (const field of fields) embed.addFields(field);
    if (image) embed.setImage(image);
    if (footer) embed.setFooter(footer);
    return embed;
};
