import { embedGenerator } from "../generators/embed";

export const dataDettesProcessing = (data: {
    [name: string]: { [name: string]: string };
}) => {
    const arrFields = [];
    for (const key in data) {
        let textField: string = "";
        for (const textKey of Object.keys(data[key])) {
            textField += `${textKey} : ${data[key][textKey]}\n`;
        }
        arrFields.push({
            name: `Pour ${key}`,
            value: textField,
        });
    }
    return embedGenerator({
        title: "Les DETTES du jour",
        fields: arrFields,
    });
};
