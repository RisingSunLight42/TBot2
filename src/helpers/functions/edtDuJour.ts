import { ChannelType } from "discord.js";
import { ClientExtend } from "../types/clientExtend";
import { dataEdtProcessing } from "./dataEdtProcessing";
import { fetchEdt } from "./fetchEdt";
import { generateEdtEmbed } from "./generateEdtEmbed";

export const edtDuJour = async (
    client: ClientExtend,
    offset: number,
    bypass: boolean
) => {
    const day = new Date(Date.now()).getDay();
    if ([0, 6].includes(day) && !bypass) return;
    const channel = await client.channels.fetch("1025734566067048498");
    if (channel?.type != ChannelType.GuildText) return;
    channel.bulkDelete(5);
    const edtDataTP1 = await fetchEdt(1185);
    const edtDataTP1Asked = await dataEdtProcessing(edtDataTP1, offset, false);
    const edtDataTP2 = await fetchEdt(1186);
    const edtDataTP2Asked = await dataEdtProcessing(edtDataTP2, offset, false);
    const embedTP1 = await generateEdtEmbed(edtDataTP1Asked);
    const embedTP2 = await generateEdtEmbed(edtDataTP2Asked);
    await channel.send({
        content:
            embedTP1.length === 0
                ? "Il semblerait que les TP2.1 n'ont pas cours aujourd'hui !"
                : "Voici l'emploi du temps du TP2.1 !",
        embeds: embedTP1,
    });
    await channel.send({
        content:
            embedTP1.length === 0
                ? "Il semblerait que les TP2.1 n'ont pas cours aujourd'hui !"
                : "Voici l'emploi du temps du TP2.2 !",
        embeds: embedTP2,
    });
};
