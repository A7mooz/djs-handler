import { CommandType, Listener, Command } from '#handler';
import { CacheType, MessageManager } from 'discord.js';
import type { Send } from '#types/command';
import conditions from '../preconditions/index.js';

export default new Listener({
    event: 'messageCreate',
    execute(message, instance) {
        if (message.author.bot) return;

        const { client } = message;

        const prefix = client.user.toString();

        if (!message.content.startsWith(prefix)) return;

        const content = message.content.replace(prefix, '').trim();

        const args = content.split(/[ ]+/);

        const name = args.shift();

        if (!name) return;

        const text = content.replace(name, '').trim();

        const command = <Command<CommandType.Text> | undefined>(
            instance.commands.find(
                (cmd) =>
                    (cmd.name === name || cmd.alias.includes(name)) &&
                    cmd.type.includes(CommandType.Text),
            )
        );

        if (!command) return;

        if (!command.dmPermission && !message.inGuild()) return;

        if (!conditions(message, command)) return;

        const send: Send<CommandType.Text, CacheType> = (options) => {
            if (typeof options === 'string')
                options = {
                    content: options,
                };

            if (!options.new || message.editedAt) {
                const reply = (<MessageManager>message.channel.messages).cache.find(
                    (v) => v.reference?.messageId === message.id && v.author.id === client.user.id,
                );

                if (reply) {
                    return reply.edit({
                        embeds: [],
                        files: [],
                        components: [],
                        content: null,
                        ...options,
                    });
                } else {
                    return message.reply(options as object);
                }
            }

            return message.reply(options);
        };

        const context = {
            client,
            instance,
            user: message.author,
            message,
            args,
            text,
            send,
        };

        Promise.all([command.execute?.(context), command.textExec?.(context)]);
    },
});
