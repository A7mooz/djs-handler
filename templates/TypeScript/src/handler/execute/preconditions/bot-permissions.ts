import { BaseInteraction, Interaction, Message } from 'discord.js';
import { AnyCommand } from './index.js';

export default function (ctx: Interaction | Message, command: AnyCommand) {
    if (!ctx.inGuild() || !command.botPermissions) return;

    let permissions = ctx.guild?.members.me?.permissions ?? null;

    if (ctx instanceof BaseInteraction) permissions = ctx.appPermissions;

    const missing = permissions
        ?.missing(command.botPermissions)
        .map((v) => `\`${v}\``)
        .join(', ');

    if (missing?.length)
        return {
            content: `I need these permissions to run this command: ${missing}`,
            ephemeral: command.category === 'private',
        };
}
