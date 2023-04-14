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
import { RegisterBehavior } from "@sapphire/framework";
import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { Message, SlashCommandBuilder } from "discord.js";

/**
 * @description The ping command.
 * @extends ImperiaCommand
 */
export class PingCommand extends ImperiaCommand {
    /**
     * @description The constructor for the ping command.
     * @param context - The command context.
     * @param options - The command options.
     */
    public constructor(context: ImperiaCommand.Context, options: ImperiaCommand.Options) {
        super(context, {
            ...options,
            name: "ping",
            description: "Get the bot's ping.",
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
    public async chatInputRun(interaction: ImperiaCommand.ChatInputCommandInteraction): Promise<Message> {
        const msg: Message = await interaction.reply({ content: `Ping?`, ephemeral: true, fetchReply: true });

        if (isMessageInstance(msg)) {
            const diff: number = msg.createdTimestamp - interaction.createdTimestamp;
            const ping: number = Math.round(this.container.client.ws.ping);
            return interaction.editReply(`Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
        }

        return interaction.editReply("Failed to retrieve ping :(");
    }
}
