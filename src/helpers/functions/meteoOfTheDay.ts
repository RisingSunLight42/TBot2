import axios from "axios";
import { ClientExtend } from "../types/ClientExtend";
import { embedGenerator } from "../generators/embed";
import { weatherCode } from "../constants/weatherCode";
import { ChannelType } from "discord.js";
require("dotenv").config();

const meteoToken = process.env.METEO_TOKEN;

export const meteoOfTheDay = async (client: ClientExtend, day: number) => {
    const channel = await client.channels.fetch("1025734566067048498");
    if (channel?.type != ChannelType.GuildText) return;
    const meteo = await axios.get(
        `https://api.meteo-concept.com/api/forecast/daily/${day}?token=${meteoToken}&insee=14341`
    );
    const forecast = meteo.data.forecast;
    const embed = embedGenerator({
        title: `Météo de Ifs pour ${day === 0 ? "aujourd'hui" : "demain"}`,
        color: "DarkBlue",
        description: `La minimale sera à ${forecast.tmin}°C et la maximale à ${forecast.tmax}°C.`,
        fields: [
            { name: "Temps", value: weatherCode[forecast.weather] },
            {
                name: "Ensoleillement",
                value: `${forecast.sun_hours} heure${
                    forecast.sun_hours > 1 ? "s" : ""
                }`,
                inline: true,
            },
            {
                name: "Probabilité de pluie",
                value: `${forecast.probarain}%`,
                inline: true,
            },
        ],
        footer: { text: "Bulletin météo fournit par l'API de Météo Concept" },
    });
    await channel.send({ embeds: [embed] });
};
