import { Command, Listener } from '#handler';
import { InteractionTypes, Send } from '#types/command';
import { CacheType } from 'discord.js';
import conditions from '../preconditions/index.js';

export default new Listener({
    event: 'interactionCreate',
    execute(interaction, instance) {
        if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

        const command = <Command<InteractionTypes> | undefined>(
            instance.commands.get(interaction.commandName)
        );
        if (!command) return;

        if (!conditions(interaction, command)) return;

        const { client, user } = interaction;

        if (interaction.isAutocomplete()) {
            command.autocompleteExec?.({
                client,
                instance,
                interaction,
                options: interaction.options,
                user,
            });
            return;
        }

        const send: Send<InteractionTypes, CacheType> = (options) => {
            if (typeof options === 'string')
                options = {
                    content: options,
                };

            options = {
                embeds: [],
                files: [],
                components: [],
                content: null,
                ephemeral: command.ephemeral,
                ...options,
            } as typeof options;

            if (interaction.replied || interaction.deferred) {
                if (options.new) return interaction.followUp(options);
                else return interaction.editReply(options);
            }

            return interaction.reply({ ...(options as object), fetchReply: true });
        };

        const context = {
            client,
            instance,
            interaction,
            options: interaction.options,
            user,
            send,
        };

        if (interaction.isChatInputCommand()) {
            command.slashExec?.({ ...context, interaction, options: interaction.options });
        } else if (interaction.isContextMenuCommand()) {
            command.contextMenuExec?.({
                ...context,
                interaction,
                options: interaction.options,
            });
        }

        command.execute?.(context);
    },
});
