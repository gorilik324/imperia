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
import { setTimeout } from "node:timers/promises";

export class ServiceUtilities extends Utility {
    /**
     * @description The constructor for the service utilities.
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
     * @description Get random number with minimum and maximum limits
     */
    public getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @description Randomize a array.
     */
    public randomArray(array: string[]): string {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * @description Trims a string to a certain length.
     */
    public trimString(str: string, length: number): string {
        return str.length > length ? str.substring(0, length) + "..." : str;
    }

    /**
     * @description Wait before fulfilling the promise.
     */
    public wait(ms: number): Promise<void> {
        return setTimeout(ms);
    }
}
