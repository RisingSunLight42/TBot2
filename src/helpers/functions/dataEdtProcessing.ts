import { Data } from "../types/data";
import { staticMonthDay } from "../constants/monthsDay";

export const dataEdtProcessing = async (
    data: Data[],
    jour: number,
    affichage: boolean,
) => {
    let jourVise = parseInt(data[0].jour);
    let moisActuel = data[0].mois;
    const anneeActuelle = data[0].annee;
    const arrDataAsked = [];

    for (let i = 0; i <= jour; i++) {
        /*
        For loop wich check if we are in a week-end to skip it.
        Also add every hours of every days if the user asks
        */
        if (staticMonthDay[moisActuel] < jourVise) {
            jourVise = 1;
            moisActuel =
                moisActuel[0] === "0" && moisActuel[1] != "9"
                    ? `0${parseInt(moisActuel) + 1}`
                    : `${parseInt(moisActuel) + 1}`;
        }
        const date = new Date(
            `${anneeActuelle}-${moisActuel}-${jourVise} 12:00:00`,
        );
        if ([0, 6].includes(date.getDay())) jourVise += 2;
        if (affichage || i === jour) {
            arrDataAsked.push(
                data.filter(
                    (data) =>
                        parseInt(data.jour) === jourVise &&
                        parseInt(data.mois) === parseInt(moisActuel),
                ),
            );
        }

        jourVise += 1;
    }

    return arrDataAsked;
};
