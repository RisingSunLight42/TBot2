import { ClientExtend } from "../types/ClientExtend";

export const isClientExtend = (object: any): object is ClientExtend => {
    return (
        "commands" in object &&
        "buttons" in object &&
        "menus" in object &&
        "modals" in object &&
        "database" in object
    );
};
