import { Data } from "../types/data";

export const dataProcessing = async (
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
        Boucle qui permet de check si jamais y'a un week-end pour le passer
        Permet aussi d'ajouter les heures de chaque jour dans la liste arrDataAsked
        Quand l'utilisateur le demande
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

    //  Fait un dernier check car dans la forme de la boucle, le dernier jour n'est pas traité
    const date = new Date(
        `${anneeActuelle}-${moisActuel}-${jourVise} 12:00:00`
    );
    if ([0, 6].includes(date.getDay())) jourVise += 2;
    arrDataAsked.push(data.filter((data) => parseInt(data.jour) === jourVise));
    return arrDataAsked;
};
