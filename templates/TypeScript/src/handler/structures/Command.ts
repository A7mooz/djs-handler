import { CommandOptions, Execute } from '#types/command';
import { CacheType, PermissionFlagsBits, PermissionsBitField } from 'discord.js';
import ms from 'ms';
import type { CustomInstance } from './Instance.js';

export class Command<T extends CommandType = CommandType> {
    readonly type: ReadonlyArray<T>;
    readonly name: string;
    readonly alias: ReadonlyArray<string>;
    readonly description: string;
    readonly category?: string;
    readonly cooldown?: number;
    readonly ephemeral: boolean;
    readonly permissions: Readonly<PermissionsBitField>;
    readonly botPermissions: Readonly<PermissionsBitField>;
    readonly defaultMemberPermissions: `${bigint}`;
    readonly dmPermission: boolean;
    readonly guildOwnerOnly: boolean;
    readonly roles: ReadonlyArray<string>;
    #guilds: ReadonlyArray<string> | 'testGuilds';
    readonly guilds: ReadonlyArray<string> = [];
    #users: ReadonlyArray<string> | 'owners';
    readonly users: ReadonlyArray<string> = [];
    readonly options?: CommandOptions<T>['options'];
    readonly init?: CommandOptions<T>['init'];
    readonly execute?: Execute<T, CacheType>;
    readonly textExec?: Execute<CommandType.Text, CacheType>;
    readonly slashExec?: Execute<CommandType.Slash, CacheType>;
    readonly contextMenuExec?: Execute<CommandType.MessageMenu | CommandType.UserMenu, CacheType>;
    readonly autocompleteExec?: Execute<'autocomplete', CacheType>;
    #instance?: CustomInstance<true>;

    constructor(data: CommandOptions<T>) {
        this.type = Array.isArray(data.type) ? data.type : [data.type];
        this.name = data.name ?? '';
        this.alias = Object.freeze(data.alias ?? []);
        this.description = data.description;
        this.category = data.category;
        if (data.cooldown) this.cooldown = ms(`${data.cooldown}`);
        this.ephemeral = Boolean(data.ephemeral);
        this.permissions = new PermissionsBitField(data.permissions).freeze();
        this.botPermissions = new PermissionsBitField(data.botPermissions).freeze();
        this.defaultMemberPermissions = `${
            this.permissions.bitfield || PermissionFlagsBits.ViewChannel
        }`;

        if (data.defaultMemberPermissions)
            this.defaultMemberPermissions = `${PermissionsBitField.resolve(
                data.defaultMemberPermissions || 0n,
            )}`;
        this.dmPermission = Boolean(data.dmPermission);
        this.guildOwnerOnly = Boolean(data.guildOwnerOnly);
        this.roles = Object.freeze(data.roles ?? []);
        this.#guilds = data.guilds ?? [];
        this.#users = data.users ?? [];
        if ('options' in data) this.options = data.options;
        if ('init' in data) this.init = data.init;

        if ('execute' in data) this.execute = data.execute as Command<T>['execute'];
        if ('textExec' in data) this.textExec = data.textExec as Command['textExec'];
        if ('slashExec' in data) this.slashExec = data.slashExec as Command<T>['slashExec'];
        if ('contextMenuExec' in data)
            this.contextMenuExec = data.contextMenuExec as Command<T>['contextMenuExec'];
        if ('autocompleteExec' in data)
            this.autocompleteExec = data.autocompleteExec as Command<T>['autocompleteExec'];
    }

    set instance(value: CustomInstance) {
        this.#instance ??= value;

        if (this.#guilds === 'testGuilds') this.#guilds = this.#instance.options.testGuildIds;
        if (this.#users === 'owners') this.#users = this.#instance.options.ownerIds;

        Object.defineProperties(this, {
            guilds: {
                value: Object.freeze(this.#guilds),
                configurable: false,
                writable: false,
            },
            users: {
                value: Object.freeze(this.#users),
                configurable: false,
                writable: false,
            },
        });
    }

    get instance() {
        if (!this.#instance) throw Error("Instance isn't defined.");

        return this.#instance;
    }
}

export const enum CommandType {
    Text,
    Slash,
    UserMenu,
    MessageMenu,
}
