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
import { RegisterBehavior, Result } from "@sapphire/framework";
import { InteractionResponse, SlashCommandBuilder } from "discord.js";
import { User as PrismaUser } from "@prisma/client";

/**
 * @description The unregister command.
 * @extends ImperiaCommand
 */
export class UnRegisterCommand extends ImperiaCommand {
    /**
     * @description The constructor for the unregister command.
     * @param context - The command context.
     * @param options - The command options.
     */
    public constructor(context: ImperiaCommand.Context, options: ImperiaCommand.Options) {
        super(context, {
            ...options,
            name: "unregister",
            description: "Unregister your account and delete all your data.",
            preconditions: ["RegisteredUserOnly"],
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
    public async chatInputRun(interaction: ImperiaCommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const getUser: Result<PrismaUser, unknown> = await Result.fromAsync(() =>
            this.container.prisma.user.findUnique({
                where: {
                    discordId: interaction.user.id,
                },
            })
        );
        const user: PrismaUser = getUser.isOk() ? getUser.unwrap() : null;

        if (!user) {
            return interaction.reply({
                content: "You are not registered.",
            });
        }

        const deleteUser: Result<PrismaUser, unknown> = await Result.fromAsync(() =>
            this.container.prisma.user.delete({
                where: {
                    discordId: interaction.user.id,
                },
            })
        );
        const deletedUser: PrismaUser = deleteUser.isOk() ? deleteUser.unwrap() : null;

        if (!deletedUser) {
            return interaction.reply({
                content: "There was an error unregistering your account.",
            });
        }

        return interaction.reply({
            content: "You have successfully unregistered your account.",
        });
    }
}
