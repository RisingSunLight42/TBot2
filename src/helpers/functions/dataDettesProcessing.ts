import { embedGenerator } from "../generators/embed";
import { ClientExtend } from "../types/ClientExtend";

export const dataDettesProcessing = async (
    client: ClientExtend,
    data: {
        [name: string]: { [name: string]: string };
    },
) => {
    const arrFields = [];
    for (const key in data) {
        let textField: string = "";
        for (const textKey of Object.keys(data[key])) {
            textField += `${textKey} : ${data[key][textKey]}\n`;
        }
        const name = await client.users.fetch(key);
        arrFields.push({
            name: `Pour ${name.username}`,
            value: textField,
        });
    }
    return embedGenerator({
        title: "Les DETTES du jour",
        description: data
            ? ""
            : "Il n'y a pas de dettes, bravo à tous, vous faites attention !",
        fields: arrFields,
    });
};
