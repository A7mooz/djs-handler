import { Execute, ListenerOptions } from '#types/listener';
import { ClientEvents, RestEvents } from 'discord.js';

export class Listener<
    Rest extends boolean = false,
    Event extends Rest extends true ? keyof RestEvents : keyof ClientEvents = Rest extends true
        ? keyof RestEvents
        : keyof ClientEvents,
> {
    readonly name: string;
    readonly event: Event;
    readonly once: boolean;
    readonly rest: boolean;
    readonly execute: Execute<Event>;
    constructor(options: ListenerOptions<Rest, Event>) {
        this.event = options.event;
        this.name = options.name ?? '';
        this.once = Boolean(options.once);
        this.rest = Boolean(options.rest);
        this.execute = options.execute;
    }

    isRest(): this is Listener<true> {
        return this.rest;
    }

    isNotRest(): this is Listener<false> {
        return !this.rest;
    }
}
