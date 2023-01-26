import { ColorResolvable } from 'discord.js';
import { O } from 'ts-toolbelt';

export type InstanceOptions = {
    /** The user IDs to use when the `users` options in a command is owners */
    ownerIds?: string[];
    /** The guild IDs to use when the `guilds` options in a command is testGuilds */
    testGuildIds?: string[];
    /** The URI used to connect to mongoDB
     *
     * `NOTE:` does **NOT** read .env when not specified for privacy and error control
     */
    mongoURI?: string;
    /** The default embed color that you can use */
    embedColor?: ColorResolvable | null;
    /** The events directory */
    eventsDir?: string;
    /** The commands directory */
    commandsDir?: string;
};

export type ResolvedInstanceOptions = O.Readonly<
    O.Required<InstanceOptions, 'ownerIds' | 'testGuildIds' | 'embedColor'>,
    keyof InstanceOptions,
    'deep'
>;
