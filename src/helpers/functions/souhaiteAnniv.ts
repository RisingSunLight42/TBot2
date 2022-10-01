import { ClientExtend } from "../types/clientExtend";
import { ref, child, get } from "firebase/database";

export const souhaiteAnniv = async (client: ClientExtend) => {
    if (!client.database) return;
    const refDB = ref(client.database);
    const annivObj = await (await get(child(refDB, "anniversaire/"))).val();
    const date = new Date(Date.now());
    for (const userID of Object.keys(annivObj)) {
        const jour = annivObj[userID].jour;
        const mois = annivObj[userID].mois;
        if (jour === date.getDate() && mois === date.getMonth() + 1) {
            const channel = await client.channels.fetch("1016629715936755775");
            if (channel?.isTextBased())
                await channel.send(
                    `Souhaitez un bon anniversaire à <@${userID}> !`
                );
        }
    }
};
