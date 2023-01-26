import { Command, CommandType } from '#handler';

export default new Command({
    type: [CommandType.Slash, CommandType.Text],
    cooldown: '10m',
    description: 'Test',
    defaultMemberPermissions: 0,
    ephemeral: true,
    execute({ send }) {
        send('Works');
    },
});
