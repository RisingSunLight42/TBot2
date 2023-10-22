import axios from "axios";
import { Data } from "../types/data";

export const fetchEdt = async (classe: number): Promise<Data[]> => {
    const edt = await axios.get(
        `https://www.stlo.unicaen.fr/edt/php/EDTReader.php?ressource=${classe}&format=week`,
    );
    return edt.data;
};
