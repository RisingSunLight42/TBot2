import { ChannelType } from "discord.js";
import { ClientExtend } from "../types/clientExtend";
import { dataEdtProcessing } from "./dataEdtProcessing";
import { fetchEdt } from "./fetchEdt";
import { generateEdtEmbed } from "./generateEdtEmbed";

export const edtDuJour = async (client: ClientExtend, offset: number) => {
    const day = new Date(Date.now()).getDay();
    if (([0, 6].includes(day) && offset === 0) || (day === 6 && offset === 1))
        return;
    const channel = await client.channels.fetch("1025734566067048498");
    if (channel?.type != ChannelType.GuildText) return;
    channel.bulkDelete(5);
    const edtDataTP1 = await fetchEdt(1185);
    const edtDataTP1Asked = await dataEdtProcessing(edtDataTP1, offset, false);
    const edtDataTP2 = await fetchEdt(1186);
    const edtDataTP2Asked = await dataEdtProcessing(edtDataTP2, offset, false);
    await channel.send({
        content: "Voici l'emploi du temps du TP2.1 !",
        embeds: await generateEdtEmbed(edtDataTP1Asked),
    });
    await channel.send({
        content: "Voici l'emploi du temps du TP2.2 !",
        embeds: await generateEdtEmbed(edtDataTP2Asked),
    });
};
