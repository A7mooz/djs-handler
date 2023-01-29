import { Command, CommandType } from '#handler';

export default new Command({
    type: [CommandType.Slash, CommandType.Text],
    cooldown: '10s',
    description: 'Test',
    defaultMemberPermissions: 0,
    ephemeral: true,
    async execute({ send }) {
        await send('Works');
    },
});
