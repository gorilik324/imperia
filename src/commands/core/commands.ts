/*
 * MIT License
 *
 * Copyright (c) 2023 aeviterna
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { ImperiaCommand } from "#/extensions/ImperiaCommand";
import { Command, CommandStore, RegisterBehavior } from "@sapphire/framework";
import { chatInputApplicationCommandMention, Collection, ComponentType, SlashCommandBuilder } from "discord.js";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";

/**
 * @description The commands command.
 * @extends ImperiaCommand
 */
export class CommandsListCommand extends ImperiaCommand {
    /**
     * @description The constructor for the commands command.
     * @param context - The command context.
     * @param options - The command options.
     */
    public constructor(context: ImperiaCommand.Context, options: ImperiaCommand.Options) {
        super(context, {
            ...options,
            name: "commands",
            description: "View a list of commands.",
        });
    }

    /**
     * @description Register the command.
     * @param registry - The command registry.
     */
    public override registerApplicationCommands(registry: ImperiaCommand.Registry) {
        const command: SlashCommandBuilder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: [],
            idHints: [],
        });
    }

    /**
     * @description Run the command.
     * @param interaction - The command interaction.
     */
    public async chatInputRun(interaction: ImperiaCommand.ChatInputCommandInteraction): Promise<PaginatedMessage> {
        await interaction.deferReply();

        const commands: CommandStore = this.container.stores.get("commands");
        const categories: string[] = [...new Set(commands.map((cmd: ImperiaCommand) => cmd.category))];
        const paginate: PaginatedMessage = new PaginatedMessage();

        for (const category of categories) {
            const categoryCommands: Collection<string, Command> = commands.filter(
                (cmd: Command): boolean => cmd.category === category
            );

            const fields: ImperiaCommand[][] = [
                ...CommandsListCommand.groupArrayInto2dArray(
                    categoryCommands.map((cmd: ImperiaCommand) => cmd),
                    3
                ),
            ];

            const commandFields: {
                name: `</${string}:${string}>`;
                value: string;
                inline: boolean;
            }[] = fields.flatMap((field) => {
                return field.map((cmd: ImperiaCommand) => {
                    const commandId: string = this.container.applicationCommandRegistries.acquire(
                        cmd.name
                    ).globalCommandId;
                    const command: `</${string}:${string}>` = chatInputApplicationCommandMention(cmd.name, commandId);
                    return { name: command, value: `${cmd.description}`, inline: true };
                });
            });

            paginate.addPageEmbed((embed) => {
                embed.setTitle(`${category.charAt(0).toUpperCase() + category.slice(1)} Commands`);
                embed.addFields(commandFields);
                return embed;
            });
        }

        const selectMenuOptions: {
            label: string;
            description: string;
            value: string;
        }[] = categories.map((category) => ({
            label: category.charAt(0).toUpperCase() + category.slice(1),
            description: `View ${category.charAt(0).toUpperCase() + category.slice(1)}-related commands.`,
            value: category,
        }));

        paginate.setActions([
            {
                customId: "help-command-experimental",
                type: ComponentType.StringSelect,
                emoji: "🧪",
                options: selectMenuOptions,
                placeholder: "Select a category...",
                run: ({ handler, interaction }) => {
                    if (interaction.isStringSelectMenu()) {
                        handler.index = categories.indexOf(interaction.values[0]);
                    }
                },
            },
        ]);

        return paginate.run(interaction);
    }

    /**
     * @description Group an array into a 2d array.
     * @param array - The array to group.
     * @param size - The size of the 2d array.
     */
    private static *groupArrayInto2dArray<T>(array: T[], size: number): Generator<T[]> {
        const total: number = array.length;
        let i = 0;
        let tempIndex = 0;
        let tempArray: T[] = [];
        while (total > i) {
            const current = array[i];
            tempArray.push(current);
            if (tempIndex === size - 1) {
                yield tempArray;
                tempArray = [];
                tempIndex = -1;
            }
            tempIndex++;
            i++;
        }
        if (tempArray.length) yield tempArray;
    }
}
