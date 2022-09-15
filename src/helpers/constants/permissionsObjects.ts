import { Permissions } from "discord.js";

export const permissionsObject: {
    [key in Permissions]: string[];
} = {
    BanMembers: [],
    ManageMessages: [],
    KickMembers: [],
    ManageRoles: [],
    Administrator: [],
};

export const permissionsSubcommandObject: { [key: string]: string[] } = {
    vent: [],
    role_description: [],
};
