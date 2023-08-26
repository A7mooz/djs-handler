import * as DJS from 'discord.js';
import { CommandType, CustomInstance } from '#handler';
import { Override } from './helpers.js';

type InteractionMap<Cached extends DJS.CacheType> = {
    [CommandType.Slash]: DJS.ChatInputCommandInteraction<Cached>;
    [CommandType.UserMenu]: DJS.UserContextMenuCommandInteraction<Cached>;
    [CommandType.MessageMenu]: DJS.MessageContextMenuCommandInteraction<Cached>;
    autocomplete: DJS.AutocompleteInteraction<Cached>;
};

type Types = keyof InteractionMap<DJS.CacheType> | CommandType.Text;

type InteractionType<
    T extends Types,
    Cached extends DJS.CacheType,
> = T extends keyof InteractionMap<Cached> ? InteractionMap<Cached>[T] : never;

type SendOptions<T extends CommandType> = T extends CommandType.Text
    ? (DJS.MessageReplyOptions & { new: true }) | (DJS.MessageEditOptions & { new?: false })
    :
          | (DJS.InteractionReplyOptions & { new: true })
          | (DJS.InteractionEditReplyOptions & { new?: false });

type Send<T extends CommandType, Cached extends DJS.CacheType> = (
    options: SendOptions<T> | string,
) => Promise<DJS.Message<DJS.BooleanCache<Cached>>>;

type BaseContext<T extends Types, Cached extends DJS.CacheType> = {
    instance: CustomInstance<true>;
    /** The current client */
    client: DJS.Client<true>;
    /** The interaction that ran the command */
    interaction: InteractionType<T, Cached>;
    /** Options for the interaction */
    options: InteractionType<T, Cached>['options'];
    /** The message that ran the command */
    message: DJS.Message<DJS.BooleanCache<Cached>>;
    /** A globalized user for all command types */
    user: DJS.User;
    /** Arguments of the command */
    args: string[];
    /** Text was sent with the command */
    text: string;
    /** A globalized function used to send replies for all command types */
    send: Send<Extract<T, CommandType>, Cached>;
};

type InteractionContext = {
    message: undefined;
    args: undefined;
    text: undefined;
};

type TextContext = {
    interaction: undefined;
    options: undefined;
};

type InteractionTypes = Exclude<CommandType, CommandType.Text>;

type Context<T extends Types, Cached extends DJS.CacheType> = T[] extends 'autocomplete'[]
    ? Omit<BaseContext<T, Cached>, keyof InteractionContext | 'send'>
    : T[] extends CommandType.Text[]
    ? Omit<BaseContext<T, Cached>, keyof TextContext>
    : T[] extends InteractionTypes[]
    ? Omit<BaseContext<T, Cached>, keyof InteractionContext>
    : T[] extends Array<infer U>
    ? U extends CommandType.Text
        ? Override<BaseContext<T, Cached>, TextContext>
        : U extends InteractionTypes
        ? Override<BaseContext<T, Cached>, InteractionContext>
        : never
    : BaseContext<T, Cached>;

type Execute<T extends Types, Cached extends DJS.CacheType> = (
    context: Context<T, Cached>,
) => DJS.Awaitable<void>;

type TypedExec<
    T extends Types,
    Cached extends DJS.CacheType,
    Extends extends CommandType,
    Type extends Types = Extends,
> = T extends Extends ? Execute<Type, Cached> : never;

interface BaseCommandOptions<T extends CommandType, Cached extends DJS.CacheType> {
    type: T[] | T;
    name?: string;
    alias?: string[];
    description: string;
    category?: string;
    cooldown?: number | `${number}${'' | 's' | 'm' | 'h' | 'd'}`;
    /** Whether to send an ephemeral messages with send function */
    ephemeral?: boolean;
    /** Permissions the member needs to run the command */
    permissions?: DJS.PermissionResolvable;
    /** Permissions the bot needs to run the command */
    botPermissions?: DJS.PermissionResolvable;
    /** default_member_permissions when registering an application command
     * @default permissions
     */
    defaultMemberPermissions?: DJS.PermissionResolvable | 0;
    /** Whether using the command in dms is allowed */
    dmPermission?: boolean;
    /** Whether make the command only accessable by the guild owner */
    guildOwnerOnly?: boolean;
    /** The roles to only allow */
    roles?: string[];
    /** The users to only allow */
    users?: 'owners' | string[];
    /** The guilds to only allow */
    guilds?: 'testGuilds' | string[];
    /** Options for `ApplicationCommandData.options` */
    options?: T extends CommandType.Slash ? DJS.ApplicationCommandOptionData[] : never;
    /** Function runs when the command is fist initiated */
    init?(instance: CustomInstance<true>): DJS.Awaitable<void>;
    /** Execute function runs when the command is ran */
    execute?: Execute<T, Cached>;
    /** Execute function runs when the text command is ran */
    textExec?: TypedExec<T, Cached, CommandType.Text>;
    /** Execute function runs when the slash command is ran */
    slashExec?: TypedExec<T, Cached, CommandType.Slash>;
    /** Execute function runs when the context menu command is ran */
    contextMenuExec?: TypedExec<
        T,
        Cached,
        Extract<T, CommandType.MessageMenu | CommandType.UserMenu>
    >;
    /** Execute function runs when autocomplete interaction is emitted on this command */
    autocompleteExec?: TypedExec<T, Cached, CommandType.Slash, 'autocomplete'>;
}

interface DMCommandOptions<T extends CommandType>
    extends BaseCommandOptions<T, 'cached' | undefined> {
    dmPermission: true;
}

interface GuildCommandOptions<T extends CommandType> extends BaseCommandOptions<T, 'cached'> {
    dmPermission?: false;
}

type CommandOptions<T extends CommandType> = DMCommandOptions<T> | GuildCommandOptions<T>;
