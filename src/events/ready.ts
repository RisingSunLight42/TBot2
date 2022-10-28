import { ActivityType } from "discord.js";
import { deployCommands, recupFichier } from "../deployCommands";
import { ClientExtend } from "../helpers/types/clientExtend";
import { ref, get, child } from "firebase/database";
import { dataDettesProcessing } from "../helpers/functions/dataDettesProcessing";
import { souhaiteAnniv } from "../helpers/functions/souhaiteAnniv";
import { edtDuJour } from "../helpers/functions/edtDuJour";
const CronJob = require("cron").CronJob;
require("dotenv").config();

const guildGestionId = process.env.GUILD_GESTION_ID;

if (!guildGestionId)
    throw new Error("L'ID de la guild de gestion est manquant !");

module.exports = {
    name: "ready",
    once: true,
    async execute(client: ClientExtend) {
        console.log(`🟢 Je suis allumé !`);

        client.user?.setPresence({
            status: "online",
            activities: [
                {
                    name: "son repo Github",
                    type: ActivityType.Watching,
                    url: "https://github.com/RisingSunLight42/EduBot",
                },
            ],
        });

        //* Push les commandes suivant si les serveurs recherchés sont présents et si c'est le bot principal
        const liste_commandes = recupFichier();
        deployCommands(liste_commandes, true);
        client.guilds.fetch().then(function (result) {
            const guild_liste_snowflake = result.map((objet) => objet.id);
            if (guild_liste_snowflake.includes(guildGestionId))
                deployCommands(liste_commandes, false);
        });

        new CronJob(
            "0 0 20 * * *",
            async function () {
                souhaiteAnniv(client);

                if (!client.database) return;
                const refDB = ref(client.database);
                client.anglais = (await get(child(refDB, "anglais/"))).val();
                const val = (await get(child(refDB, "dettes/"))).val();
                const embed = await dataDettesProcessing(client, val);
                const channel = await client.channels.fetch(
                    "1016397992674218035"
                );
                if (channel?.isTextBased())
                    await channel.send({ embeds: [embed] });

                if (!(await get(child(refDB, "edtParam/"))).val()) return;
                edtDuJour(client, 1, false);
            },
            null,
            true,
            "Europe/Paris"
        );

        new CronJob(
            "0 0 6 * * *",
            async function () {
                if (!client.database) return;
                const refDB = ref(client.database);
                if (!(await get(child(refDB, "edtParam/"))).val()) return;
                edtDuJour(client, 0, false);
            },
            null,
            true,
            "Europe/Paris"
        );
    },
};
