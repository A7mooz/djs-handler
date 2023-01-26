import { CustomInstance } from '#handler';
import { Awaitable, ClientEvents, RestEvents } from 'discord.js';
import { F } from 'ts-toolbelt';

type EventArgs<Event> = Event extends keyof RestEvents
    ? RestEvents[Event]
    : Event extends keyof ClientEvents
    ? ClientEvents[Event]
    : never;

type Execute<Event extends keyof RestEvents | keyof ClientEvents> = F.Function<
    [...args: EventArgs<Event>, instance: CustomInstance<true>],
    Awaitable<void>
>;

type ListenerOptions<Rest extends boolean, Event extends keyof RestEvents | keyof ClientEvents> = {
    /** The event to listen to */
    event: Event;
    /** The function to run when the event fires */
    execute: Execute<Event>;
    /** Whether the event is rest */
    rest?: Rest;
    /** Whether the event fires onece */
    once?: boolean;
    name?: string;
};
