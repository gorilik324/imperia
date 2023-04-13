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

import { Listener } from "@sapphire/framework";
import { ImperiaEvents } from "#/typings/imperia";

/**
 * @description The ready listener.
 * @extends Listener
 */
export class ReadyListener extends Listener {
    /**
     * @description The constructor for the ready listener.
     * @param context - The listener context.
     */
    public constructor(context: Listener.Context) {
        super(context, {
            name: "ready",
            once: true,
            event: ImperiaEvents.ClientReady,
        });
    }

    /**
     * @description The run method for the ready listener.
     */
    public async run(): Promise<void> {
        const userCount = this.container.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const guildCount = this.container.client.guilds.cache.size;

        this.container.logger.info(`ReadyListener: Logged in as ${this.container.client.user?.tag}!`);
        this.container.logger.info(`ReadyListener: Serving ${guildCount} guilds and ${userCount} users!`);
        this.container.logger.info(`ReadyListener: Loaded ${this.container.stores.get("commands").size} commands.`);
        this.container.logger.info(`ReadyListener: Loaded ${this.container.stores.get("listeners").size} listeners.`);
    }
}
