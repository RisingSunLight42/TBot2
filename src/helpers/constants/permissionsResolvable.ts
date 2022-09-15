import { PermissionFlagsBits, PermissionResolvable } from "discord.js";

export const permissionResolvableObject: {
    [key: string]: PermissionResolvable;
} = {
    BanMembers: PermissionFlagsBits.BanMembers,
    ManageMessages: PermissionFlagsBits.ManageMessages,
    KickMembers: PermissionFlagsBits.KickMembers,
    ManageRoles: PermissionFlagsBits.ManageRoles,
    Administrator: PermissionFlagsBits.Administrator,
};
