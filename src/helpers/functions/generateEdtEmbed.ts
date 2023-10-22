import { staticDay } from "../constants/daysCode";
import { staticMonth } from "../constants/monthsCode";
import { embedGenerator } from "../generators/embed";
import { Data } from "../types/data";

export const generateEdtEmbed = async (edtDataAsked: Data[][]) => {
    const arrEmbed = [];
    for (const jourData of edtDataAsked) {
        if (jourData.length != 0) {
            const numJour = parseInt(jourData[0].jour);
            const numMonth = jourData[0].mois;
            const year = jourData[0].annee;
            const day = new Date(
                `${year}-${numMonth}-${numJour} 12:00:00`,
            ).getDay();
            const arrFields = [];
            for (const heureData of jourData) {
                arrFields.push({
                    name: `${heureData.hDebut} - ${heureData.hFin}`,
                    value: `${heureData.cours}\n${heureData.enseignant}\nSalle : ${heureData.salle}`,
                });
            }
            arrEmbed.push(
                embedGenerator({
                    title: `Emploi du Temps du ${staticDay[day]} ${numJour} ${staticMonth[numMonth]} ${year}`,
                    fields: arrFields,
                }),
            );
        }
    }
    return arrEmbed;
};
