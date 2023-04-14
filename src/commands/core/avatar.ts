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
import { InteractionResponse, SlashCommandBuilder, User, GuildMember, EmbedBuilder } from "discord.js";

/**
 * @description The about command.
 * @extends ImperiaCommand
 */
export class AboutCommand extends ImperiaCommand {
    /**
     * @description The constructor for the about command.
     * @param context - The command context.
     * @param options - The command options.
     */
    public constructor(context: ImperiaCommand.Context, options: ImperiaCommand.Options) {
        super(context, {
            ...options,
            name: "avatar",
            description: "Display the user's avatar(s)",
        });
    }

    /**
     * @description Register the command.
     * @param registry - The command registry.
     */
    public override registerApplicationCommands(registry: ImperiaCommand.Registry) {
        const command: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption((option) =>
                option.setName("user").setDescription("Check a user's avatar.").setRequired(false)
            );

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
        return this.showAvatar(interaction);
    }

    private async showAvatar(ctx: ImperiaCommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const user: User = ctx.options.getUser("user") || ctx.user;
        const userInGuild: GuildMember = await ctx.guild.members.fetch(user.id);

        const iconURL: string = user.displayAvatarURL({ size: 4096 });
        const userInGuildIconURL: string = userInGuild.displayAvatarURL({ size: 4096 });

        const avatarEmbed = [
            new EmbedBuilder().setImage(iconURL).setAuthor({ name: user.tag, iconURL }),
            new EmbedBuilder().setImage(userInGuildIconURL),
        ];

        if (user.displayAvatarURL() !== userInGuild.displayAvatarURL()) {
            return ctx.reply({ embeds: avatarEmbed });
        }

        return ctx.reply({ embeds: [avatarEmbed[0]] });
    }
}
