import { Collection, Interaction, Message, time } from 'discord.js';
import { AnyCommand } from './index.js';
import ms from 'ms';

const cache = new Collection<string, Date>();

setInterval(() => {
    cache.sweep((v) => v < new Date());
}, ms('1m'));

export default function (ctx: Message | Interaction, command: AnyCommand) {
    if (!command.cooldown || command.cooldown < 1) return;

    const { guildId, channelId } = ctx;

    const userId = ctx instanceof Message ? ctx.author.id : ctx.user.id;

    const cooldownStr = `${guildId ?? channelId}-${userId}`;

    const cooldown = cache.get(cooldownStr);

    if (cooldown && cooldown > new Date())
        return `You are being too fast, you can reuse the command ${time(cooldown, 'R')}`;
    else cache.set(cooldownStr, new Date(Date.now() + command.cooldown));
}
