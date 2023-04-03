import { ActivityType } from "discord.js";
import { deployCommands, recupFichier } from "../deployCommands";
import { ClientExtend } from "../helpers/types/clientExtend";
import { ref, get, child, set } from "firebase/database";
import { dataDettesProcessing } from "../helpers/functions/dataDettesProcessing";
import { souhaiteAnniv } from "../helpers/functions/souhaiteAnniv";
import { edtDuJour } from "../helpers/functions/edtDuJour";
import { readFileSync } from "fs";
import path from "path";
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
                if (!client.database) return;
                const refDB = ref(client.database);
                client.anglais = (await get(child(refDB, "anglais/"))).val();

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

        new CronJob(
            "0 0 0 * * *",
            async function () {
                souhaiteAnniv(client);
                const minute = Math.floor(Math.random() * 60);
                const heure = Math.floor(Math.random() * 23);
                if (client.tempsMotRandom)
                    client.tempsMotRandom = { minute, heure };
            },
            null,
            true,
            "Europe/Paris"
        );

        new CronJob(
            "0 * * * * *",
            async function () {
                if (!client.tempsMotRandom || !client.database) return;
                const temps = client.tempsMotRandom;
                const date = new Date();
                if (
                    temps.minute != date.getMinutes() ||
                    temps.heure != date.getHours()
                )
                    return;
                const arrWord = readFileSync(
                    path.join(
                        __dirname,
                        ".",
                        "helpers/misc/pizza_chevre_rotule_base_planisphere.txt"
                    ),
                    "utf-8"
                ).split("\r\n");
                const refDB = ref(client.database);
                const val: string[] = (await get(child(refDB, "mots/"))).val();
                arrWord.filter((value) => !val.includes(value));
                const mot = arrWord[Math.floor(Math.random() * arrWord.length)];
                const guild = await client.guilds.fetch("1016387121717706882");
                const salons = (await guild.channels.fetch()).filter(
                    (channel) =>
                        ![
                            "1025734566067048498",
                            "1019670097100537877",
                        ].includes(channel.id) && channel.isTextBased()
                );
                const salon = salons.random();
                if (!salon) return;
                if (salon.isTextBased()) salon.send(mot);
                await set(child(refDB, `mots/${val.length}`), mot);
            },
            null,
            true,
            "Europe/Paris"
        );
    },
};
