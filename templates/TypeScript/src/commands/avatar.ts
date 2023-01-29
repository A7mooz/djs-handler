import { Command, CommandType } from '#handler';
import { ApplicationCommandOptionType } from 'discord.js';

export default new Command({
    type: [CommandType.UserMenu, CommandType.Slash],
    description: "Get user's profile avatar.",
    ephemeral: true,
    options: [
        {
            name: 'user',
            description: 'The target user',
            type: ApplicationCommandOptionType.User,
        },
    ],
    async execute({ send, options, user }) {
        const target = options.getUser('user') ?? user;

        const avatar = target.displayAvatarURL();

        console.log('The avatar:', avatar, '\n');

        await send({
            files: [avatar],
        });
    },
});
