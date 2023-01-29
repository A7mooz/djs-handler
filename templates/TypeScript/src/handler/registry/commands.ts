import { Command, CustomInstance, CommandType } from '#handler';
import { existsSync } from 'fs';
import { getAllFiles, _dirname } from '../util/file.js';
import { extname, join } from 'path';
import { pathToFileURL } from 'url';
import { ApplicationCommandData, ApplicationCommandType, Routes } from 'discord.js';

export async function initiateCommands(instance: CustomInstance) {
    await handleCommands(instance);
    registerCommands(instance);
}

export async function handleCommands(instance: CustomInstance) {
    const commandsDir = instance.options.commandsDir;
    if (!commandsDir) return;

    if (!existsSync(join(_dirname, commandsDir)))
        return process.emitWarning(`The commands folder "${commandsDir}" doesn't exist.`, {
            detail: 'The folder could be empty and not emitted.',
            code: 'COMMANDS_FOLDER_NOT_FOUND',
        });

    async function readFolder(dir: string) {
        const files = getAllFiles(dir);

        for (const file of files) {
            if (file.isDirectory()) {
                await readFolder(join(dir, file.name));
                return;
            }

            const { default: command } = await import(
                `${pathToFileURL(join(_dirname, dir, file.name))}`
            );

            const name = file.name.replace(extname(file.name), '');

            if (!(command instanceof Command)) continue;

            if (!command.name)
                Object.defineProperty(command, 'name', {
                    value: name,
                    configurable: false,
                    writable: false,
                });

            command.instance = instance;

            if (instance.commands.has(command.name)) {
                process.emitWarning(`Detected douplicate of the command \`${command.name}\`.`, {
                    detail: "You can't have mutiple commands with the same name.",
                });
                continue;
            }

            instance.commands.set(command.name, command);
        }
    }

    return await readFolder(commandsDir);
}

export async function registerCommands(instance: CustomInstance) {
    const { client } = instance;

    const [guildCommands, globalCommands] = instance.commands.partition((cmd) => cmd.guilds.length);

    function format(
        type: ApplicationCommandType,
        command: Command<CommandType>,
    ): ApplicationCommandData {
        return {
            type,
            name: command.name,
            description: type === ApplicationCommandType.ChatInput ? command.description : '',
            defaultMemberPermissions: command.defaultMemberPermissions,
            dmPermission: command.dmPermission,
            options: type === ApplicationCommandType.ChatInput ? command.options : undefined,
        };
    }

    const map = (cmd: Command<CommandType>) =>
        cmd.type
            .filter((t) => ApplicationCommandType[t])
            .flatMap((t) => format(t as unknown as ApplicationCommandType, cmd));

    const data = globalCommands.map(map).flat();

    const applicationId = client.application?.id ?? '';

    await client.rest.put(Routes.applicationCommands(applicationId), {
        body: client.options.jsonTransformer?.(data),
    });

    console.log(`[ Command Handler ] - Synced ${data.length} global commands`);

    for (const [guildId, guild] of client.guilds.cache) {
        const commands = guildCommands.filter((cmd) => cmd.guilds.includes(guild.id));
        if (!commands.size) {
            if (instance.options.testGuildIds.includes(guild.id)) {
                await guild.commands.set([]);

                console.log(`[ ${guild.name} ] - Removed commands because it's a test guild`);
            }
            continue;
        }

        const data = commands.map(map).flat();

        console.log(`[ ${guild.name} ] - Synced ${data.length} commands`);

        await client.rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
            body: client.options.jsonTransformer?.(data),
        });
    }
}
