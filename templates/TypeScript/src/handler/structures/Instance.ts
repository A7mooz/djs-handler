import { Client, Collection } from 'discord.js';
import mongoose from 'mongoose';
import { optionsClient, optionsInstance } from '../config.js';
import { handleListeners, initiateCommands } from '../registry/index.js';
import type { Command, CommandType } from './Command.js';
import type { Listener } from './Listener.js';
import { ResolvedInstanceOptions } from '#types/instance';

export class CustomInstance<Ready extends boolean = boolean> {
    #client: Client;
    readonly options: ResolvedInstanceOptions;
    readonly listeners = new Collection<string, Listener<boolean>>();
    readonly commands = new Collection<string, Command<CommandType>>();
    constructor() {
        this.#client = new Client(optionsClient);

        const options = optionsInstance;
        this.options = {
            ownerIds: options.ownerIds ?? [],
            testGuildIds: options.testGuildIds ?? [],
            embedColor: options.embedColor ?? null,
            mongoURI: options.mongoURI,
            eventsDir: options.eventsDir,
            commandsDir: options.commandsDir,
        };

        Object.defineProperty(this.options, 'mongoURI', {
            enumerable: false,
        });

        this.options = Object.freeze(this.options);
    }

    isReady(): this is CustomInstance<true> {
        return this.#client.isReady();
    }

    get client(): Client<Ready> {
        return this.#client;
    }

    async start(token?: string) {
        await this.#client.login(token);

        console.log(
            `[ ${this.#client.user?.tag} ] - Connected to Discord with ${
                this.#client.ws.ping
            } ping!`,
        );

        await this.mongo(this.options.mongoURI);

        await handleListeners(this, 'execute/listeners');

        await initiateCommands(this);

        return this;
    }

    async mongo(uri?: string) {
        if (!uri) return mongoose;

        mongoose.set('strictQuery', false);

        const result = await mongoose.connect(uri);

        console.log('[ MongoDB Connection ] - Connected to mongoDB successfully!');

        return result;
    }
}
