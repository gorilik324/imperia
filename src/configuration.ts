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

import { ActivityType, GatewayIntentBits, Partials, ShardingManagerOptions } from "discord.js";
import { ImperiaClientOptions } from "#/extensions/ImperiaClient";
import { Time } from "@sapphire/time-utilities";
import * as process from "process";
import { LogLevel } from "@sapphire/framework";

/**
 * @description The configuration for the ImperiaClient class.
 * @see ImperiaClient
 */
export const configuration: ImperiaClientOptions = {
    defaultCooldown: {
        delay: Time.Second * 2,
    },
    defaultPrefix: process.env.DEFAULT_PREFIX ?? "imp!",
    enableAnalytics: process.env.ANALYTICS_ENABLED === "true" ?? false,
    enableLoaderTraceLoggings: true,
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
    loadApplicationCommandRegistriesStatusListeners: process.env.NODE_ENV === "production",
    loadDefaultErrorListeners: true,
    loadMessageCommandListeners: false,
    logger: {
        level: process.env.NODE_ENV === "production" ? LogLevel.Info : LogLevel.Debug,
    },
    overrideApplicationCommandRegistries: true,
    partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],
    presence: {
        activities: [
            {
                type: ActivityType.Playing,
                name: `with the bois ✨`,
            },
        ],
        status: "dnd",
    },
    typing: true,
};

/**
 * @description The configuration for a sharding manager.
 */
export const sharding: ShardingManagerOptions = {
    mode: "worker",
    shardList: "auto",
};
