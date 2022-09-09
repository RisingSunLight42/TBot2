import axios from "axios";

export const fetchEdt = async (classe: number) => {
    const edt = await axios.get(
        `https://zimmermanna.users.greyc.fr/edt/php/EDTReader.php?ressource=${classe}&format=week`
    );
    return edt.data;
};
