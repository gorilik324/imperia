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

import { Utility } from "@sapphire/plugin-utilities-store";

export class TimeUtilities extends Utility {
    /**
     * @description The constructor for the time utilities.
     * @param context - The utility context.
     * @param options - The utility options.
     */
    public constructor(context: Utility.Context, options: Utility.Options) {
        super(context, {
            ...options,
            name: "time",
        });
    }

    /**
     * @description Format milliseconds into human readable format.
     * @param ms - The milliseconds to format.
     */
    public formatTime(ms: number): string {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 12);
        const months = Math.floor(days / 30);

        if (months > 0) {
            return `${months} month(s) ${days % 30} day(s) ${hours} hour(s) ${minutes % 60} minute(s)`;
        } else if (days > 0) {
            return `${days} day(s) ${hours % 12} hour(s) ${minutes % 60} minute(s)`;
        } else if (hours > 0) {
            return `${hours} hour(s) ${minutes % 60} minute(s)`;
        } else if (minutes > 0) {
            return `${minutes} minute(s) and ${seconds % 60} second(s)`;
        } else {
            return `${seconds} second(s)`;
        }
    }

    /**
     * @description Format miliseconds into 00:00:00 format.
     * @param ms - The milliseconds to format.
     */
    public formatTimestamp(ms: number): string {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${this.pad(hours, 2)}:${this.pad(minutes % 60, 2)}:${this.pad(seconds % 60, 2)}`;
        } else if (minutes > 0) {
            return `${this.pad(minutes, 2)}:${this.pad(seconds % 60, 2)}`;
        } else {
            return `${this.pad(seconds, 2)}`;
        }
    }

    /**
     * @description Convert hours into days.
     * @param hours - The hours to convert.
     */
    public hoursToDays(hours: number): number {
        return hours / 24;
    }

    /**
     * @description Convert minutes into hours.
     * @param minutes - The minutes to convert.
     */
    public minutesToHours(minutes: number): number {
        return minutes / 60;
    }

    /**
     * @description Convert minutes into milliseconds.
     * @param minutes - The minutes to convert.
     */
    public minutesToMs(minutes: number): number {
        return minutes * 60 * 1000;
    }

    /**
     * @description Convert milliseconds into seconds.
     * @param ms - The milliseconds to convert.
     */
    public msToSeconds(ms: number): number {
        return ms / 1000;
    }

    /**
     * @description Convert milliseconds into day
     * @param ms - The milliseconds to convert.
     */
    public msToDays(ms: number): number {
        return ms / (1000 * 60 * 60 * 24);
    }

    /**
     * @description Pad a string with a certain length.
     * @param num - The number to pad.
     * @param size - The size to pad to.
     */
    public pad(num: number, size: number): string {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    /**
     * @description Convert seconds into milliseconds.
     * @param seconds - The seconds to convert.
     */
    public secondsToMinutes(seconds: number): number {
        return seconds / 60;
    }

    /**
     * @description Convert seconds into milliseconds.
     * @param seconds - The seconds to convert.
     */
    public secondsToMs(seconds: number): number {
        return seconds * 1000;
    }
}
