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

import { Subcommand, SubcommandOptions } from "@sapphire/plugin-subcommands";
import { ChatInputCommand } from "@sapphire/framework";

/**
 * @description The ImperiaCommand class.
 * @extends Subcommand
 */
export abstract class ImperiaCommand extends Subcommand {
    /**
     * @description The constructor for the ImperiaCommand class.
     * @param context - The context for the command.
     * @param options - The options for the command.
     * @protected
     */
    protected constructor(context: Subcommand.Context, options: SubcommandOptions) {
        super(context, {
            ...options,
        });
    }

    /**
     * @description The run method for the chat input command.
     * @param interaction - The interaction for the command.
     * @param context - The context for the command.
     */
    // @ts-ignore: Promise<unknown> instead of Promise<void>
    public async chatInputRun(
        interaction: ChatInputCommand.Interaction,
        context: ChatInputCommand.RunContext
    ): Promise<unknown> {
        return super.chatInputRun(interaction, context);
    }
}

export declare namespace ImperiaCommand {
    type Options = SubcommandOptions;
    type JSON = Subcommand.JSON;
    type Context = Subcommand.Context;
    type RunInTypes = Subcommand.RunInTypes;
    type ChatInputCommandInteraction = Subcommand.ChatInputCommandInteraction;
    type ContextMenuCommandInteraction = Subcommand.ContextMenuCommandInteraction;
    type AutocompleteInteraction = Subcommand.AutocompleteInteraction;
    type Registry = Subcommand.Registry;
}
