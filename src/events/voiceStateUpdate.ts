import { ChannelType, VoiceState } from "discord.js";
import { ClientExtend } from "../helpers/types/ClientExtend";

module.exports = {
    name: "voiceStateUpdate",
    async execute(
        client: ClientExtend,
        oldState: VoiceState,
        newState: VoiceState,
    ) {
        const sourceVoiceChannelID = "1092542204389621790";
        const sourceCategoryID = "1092539867092762776";
        if (newState.channelId === sourceVoiceChannelID) {
            const duplicateChannel = await newState.guild.channels.create({
                name: `Salon de ${newState.member?.nickname}`,
                type: ChannelType.GuildVoice,
                reason: "Duplication du salon pour le gaming de gamers.",
            });

            if (newState.channel?.parent)
                duplicateChannel.setParent(newState.channel.parent);

            newState.setChannel(
                duplicateChannel,
                "Déplacement sur le salon dupliqué",
            );
        } else if (
            newState.channelId === null &&
            oldState.channelId != sourceVoiceChannelID &&
            oldState.channel?.parentId === sourceCategoryID &&
            oldState.channel.members.size === 0
        ) {
            oldState.channel.delete();
        }
    },
};
