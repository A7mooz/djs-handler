import { BaseInteraction, Interaction, Message, roleMention } from 'discord.js';
import { AnyCommand } from './index.js';

export default function (ctx: Message | Interaction, command: AnyCommand) {
    const user = ctx instanceof Message ? ctx.author : ctx.user;

    if (command.users.length && !command.users.includes(user.id)) return true;

    if (!ctx.inGuild()) return;

    const { member } = ctx;
    if (!member) return;

    if (command.guildOwnerOnly && member.user.id !== ctx.guild?.ownerId)
        return 'This command is only for the server owner.';

    let permissions = ctx.guild?.members.me?.permissions ?? null;
    let roles: Set<string>;

    if (ctx instanceof BaseInteraction) {
        permissions = ctx.appPermissions;
        if (Array.isArray(member.roles)) roles = new Set(member.roles);
        else roles = new Set(member.roles.cache.keys());
    } else roles = new Set(ctx.member?.roles.cache.keys());

    const missingPerms = permissions
        ?.missing(command.permissions)
        .map((v) => `\`${v}\``)
        .join(', ');

    if (missingPerms?.length) return `You're missing the following permissions: ${missingPerms}`;

    if (command.roles.length && !command.roles.some((v) => roles.has(v)))
        return `You're missing the following roles: ${command.roles.map(roleMention)}`;
    roles.clear();
}
