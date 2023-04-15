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
import { EmbedBuilder, InteractionResponse, SlashCommandBuilder, codeBlock, GuildPremiumTier } from "discord.js";
import dayjs from "dayjs";

/**
 * @description The server info command.
 * @extends ImperiaCommand
 */
export class ServerInfoCommand extends ImperiaCommand {
    /**
     * @description The constructor for the server info command.
     * @param context - The command context.
     * @param options - The command options.
     */
    public constructor(context: ImperiaCommand.Context, options: ImperiaCommand.Options) {
        super(context, {
            ...options,
            name: "serverinfo",
            description: "Display information about server.",
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
        const fieldResponses = await this.getFieldResponses(interaction);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ size: 4096 }) })
                    .addFields([...fieldResponses]),
            ],
        });
    }

    /**
     * @description Get server information.
     * @param ctx - The command context.
     */
    private async getServerInformation(ctx: ImperiaCommand.ChatInputCommandInteraction) {
        const premiumTier: string[] = ["None", "Tier 1", "Tier 2", "Tier 3"];

        return {
            bio: {
                createdAt: dayjs(ctx.guild.createdAt),
                description: ctx.guild.description === null ? "No Description" : ctx.guild.description,
                id: ctx.guild.id,
                name: ctx.guild.name,
                ownership: (await ctx.guild.fetchOwner()).user,
            },
            statistic: {
                serverRoles: ctx.guild.roles.cache.size,
                emojis: ctx.guild.emojis.cache.size,
                members: ctx.guild.memberCount,
                channels: ctx.guild.channels.cache.size,
                stickers: ctx.guild.stickers.cache.size,
            },
            features: {
                boostLevel: premiumTier[ctx.guild.premiumTier],
                boostCount: ctx.guild.premiumSubscriptionCount,
                verifiedStatus: ctx.guild.verified ? "Verified" : "Not Verified",
                partneredStatus: ctx.guild.partnered ? "Partnered" : "Not Partnered",
                vanityURL: ctx.guild.vanityURLCode == null ? "-" : `https://discord.gg/${ctx.guild.vanityURLCode}`,
            },
        };
    }

    /**
     * @description Get embed field responses.
     * @param ctx - The command context.
     */
    private async getFieldResponses(ctx: ImperiaCommand.ChatInputCommandInteraction) {
        const { bio, statistic, features } = await this.getServerInformation(ctx);

        const info: string[] = [
            `⊱ Name            :  ${bio.name}`,
            `⊱ Server Id       :  ${bio.id}` + "ㅤ",
            `⊱ Time Created    :  ${bio.createdAt.format("MMM, DD YYYY")}`,
            `⊱ Ownership       :  ${bio.ownership.username}`,
        ];

        const stats: string[] = [
            `⊱ Roles           :  ${statistic.serverRoles}`,
            `⊱ Emojis          :  ${statistic.emojis}`,
            `⊱ Members         :  ${statistic.members}`,
            `⊱ Channels        :  ${statistic.channels}`,
            `⊱ Stickers        :  ${statistic.stickers}`,
        ];

        const feats: string[] = [
            `⊱ Boost Level     :  ${features.boostLevel}`,
            `⊱ Boost Count     :  ${features.boostCount}`,
            `⊱ Verified        :  ${features.verifiedStatus}`,
            `⊱ Partnered       :  ${features.partneredStatus}`,
            `⊱ Vanity URL      :  ${features.vanityURL}`,
        ];

        return [
            { name: "⊰・Information・⊱", value: codeBlock(info.join("\n")) },
            { name: "⊰・Description・⊱", value: codeBlock(bio.description) },
            { name: "⊰・Statistics・⊱", value: codeBlock(stats.join("\n")) },
            { name: "⊰・Features・⊱", value: codeBlock(feats.join("\n")) },
        ];
    }
}
