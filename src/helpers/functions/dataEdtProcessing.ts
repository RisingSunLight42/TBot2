import { Data } from "../types/data";

export const dataEdtProcessing = async (
    data: Data[],
    jour: number,
    affichage: boolean
) => {
    let jourVise = parseInt(data[0].jour);
    const moisActuel = data[0].mois;
    const anneeActuelle = data[0].annee;
    const arrDataAsked = [];

    for (let i = 0; i < jour; i++) {
        /*
        For loop wich check if we are in a week-end to skip it.
        Also add every hours of every days if the user asks
        */
        const date = new Date(
            `${anneeActuelle}-${moisActuel}-${jourVise} 12:00:00`
        );
        if ([0, 6].includes(date.getDay())) jourVise += 2;
        if (affichage)
            arrDataAsked.push(
                data.filter((data) => parseInt(data.jour) === jourVise)
            );
        jourVise += 1;
    }

    // Do a last check because the last day is not parsed in the loop
    const date = new Date(
        `${anneeActuelle}-${moisActuel}-${jourVise} 12:00:00`
    );
    if ([0, 6].includes(date.getDay())) jourVise += 2;
    arrDataAsked.push(data.filter((data) => parseInt(data.jour) === jourVise));
    return arrDataAsked;
};
