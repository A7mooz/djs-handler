import { ClientOptions } from 'discord.js';
import { InstanceOptions } from '#types/instance';

export const optionsClient: ClientOptions = {
    intents: ['Guilds', 'GuildMessages'],
    allowedMentions: {
        parse: [],
    },
    failIfNotExists: false,
};

export const optionsInstance: InstanceOptions = {
    ownerIds: [],
    testGuildIds: [],
    mongoURI: process.env.MONGO_URI,
    eventsDir: 'events',
    commandsDir: 'commands',
};
