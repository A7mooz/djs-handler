import { Listener } from '#handler';

export default new Listener({
    event: 'messageDelete',
    execute(message) {
        if (
            !message.mentions.users.size ||
            message.mentions.users.every((user) => user.bot || user.id === message.author?.id) ||
            !message.inGuild()
        )
            return;

        console.log(
            `Ghostping by ${message.author.tag} in #${message.channel.name} (Server ID: ${message.guildId})\nmentioned:`,
            message.mentions.users.map((user) => user.tag),
        );
    },
});
