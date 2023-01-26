import { CustomInstance, Listener } from '#handler';
import { ClientEvents, RestEvents } from 'discord.js';
import { existsSync } from 'fs';
import { extname, join } from 'path';
import { pathToFileURL } from 'url';
import { getAllFiles, _dirname } from '../util/file.js';

export async function handleListeners(instance: CustomInstance, innerDir?: string) {
    const eventsDir = instance.options.eventsDir;
    const handlerDir = 'handler';

    async function readFolder(dir: string, cache?: boolean) {
        const files = getAllFiles(dir);

        for (const file of files) {
            if (file.isDirectory()) {
                await readFolder(join(dir, file.name));
                return;
            }

            const { default: listener } = (await import(
                `${pathToFileURL(join(_dirname, dir, file.name))}`
            )) as { default: Listener<boolean> };

            const name = `${dir}/${file.name}`
                .replace(extname(file.name), '')
                .replace(`${instance.options.eventsDir}/`, '');

            if (!(listener instanceof Listener)) continue;

            if (!listener.name)
                Object.defineProperty(listener, 'name', {
                    value: name,
                    configurable: false,
                    writable: false,
                });

            if (cache) instance.listeners.set(name, listener);

            const { client } = instance;

            const fn = (...args: ClientEvents[keyof ClientEvents] | RestEvents[keyof RestEvents]) =>
                listener.execute(...args, instance);

            if (listener.isRest()) {
                if (listener.once) client.rest.once(listener.event, fn);
                else client.rest.on(listener.event, fn);
            } else if (listener.isNotRest()) {
                if (listener.once) client.once(listener.event, fn);
                else client.on(listener.event, fn);
            }
        }
    }

    if (innerDir) await readFolder(join(handlerDir, innerDir), false);

    if (!eventsDir) return;
    if (!existsSync(join(_dirname, eventsDir)))
        return process.emitWarning(`The events folder "${eventsDir}" doesn't exist.`, {
            detail: 'The folder could be empty and not emitted.',
            code: 'EVENTS_FOLDER_NOT_FOUND',
        });
    await readFolder(eventsDir);
}
