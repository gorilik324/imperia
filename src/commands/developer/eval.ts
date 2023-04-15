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
import {
    codeBlock,
    EmbedBuilder,
    InteractionResponse,
    SlashCommandBooleanOption,
    SlashCommandBuilder,
    SlashCommandStringOption,
} from "discord.js";
import { RegisterBehavior } from "@sapphire/framework";
import { isThenable } from "@sapphire/utilities";
import { DEVELOPMENT_SERVERS } from "#/utils/constants";
import { inspect } from "util";

/**
 * @description The eval command.
 * @extends ImperiaCommand
 */
export class EvaluateCommand extends ImperiaCommand {
    /**
     * @description The constructor for the eval command.
     * @param context - The command context.
     * @param options - The command options.
     */
    public constructor(context: ImperiaCommand.Context, options: ImperiaCommand.Options) {
        super(context, {
            ...options,
            name: "eval",
            description: "Perform a JavaScript evaluation of the provided code.",
            preconditions: ["DeveloperOnly"],
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
            .addStringOption((option: SlashCommandStringOption) => {
                return option.setName("code").setDescription("The code to evaluate.").setRequired(true);
            })
            .addBooleanOption((option: SlashCommandBooleanOption) => {
                return option.setName("ephemeral").setDescription("Whether to run the code in an ephemeral message.");
            });

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: DEVELOPMENT_SERVERS,
            idHints: [],
        });
    }

    /**
     * @description Run the command.
     * @param interaction - The command interaction.
     */
    public async chatInputRun(interaction: ImperiaCommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const code: string = interaction.options.getString("code", true);
        const ephemeral: boolean = interaction.options.getBoolean("ephemeral", false) ?? false;

        if (this.checkForSensitiveKeywords(code)) {
            return interaction.reply({
                content: "You can't use that sensitive keywords.",
                ephemeral: ephemeral,
                files: [{ attachment: "https://c.tenor.com/ureTfAf6B3EAAAAM/no-jerry.gif" }],
            });
        }

        const content: EmbedBuilder = new EmbedBuilder();

        try {
            let evaled = eval(code);
            if (isThenable(evaled)) evaled = await evaled;
            if (typeof evaled !== "string") evaled = inspect(evaled, { depth: 0 });

            content.setDescription(codeBlock("js", this.handleEvaledCode(String(evaled))));
        } catch (error) {
            content.setDescription(codeBlock("bash", this.handleEvaledCode(String(error))));
            this.container.logger.error(error);
        }

        return interaction.reply({
            embeds: [content],
        });
    }

    /**
     * @description Handle the evaled code.
     * @param code - The code to handle.
     */
    private handleEvaledCode(code: string): string {
        if (typeof code !== "string") return code;

        if (code.length > 1900) code = code.slice(0, 1900) + "...";

        return code
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(new RegExp(process.env.DATABASE_URL, "g"), "[DATABASE_URL]")
            .replace(new RegExp(process.env.DISCORD_TOKEN, "g"), "[DISCORD_TOKEN]");
    }

    /**
     * @description Check for sensitive keywords.
     * @param code - The code to check.
     */
    private checkForSensitiveKeywords(code: string): boolean {
        const sensitiveKeywords: string[] = [
            "process",
            "process.env",
            "process.kill",
            "process.exit",
            "child_process",
            "eval",
            "exec",
            "execSync",
            "spawn",
            "spawnSync",
        ];

        return sensitiveKeywords.some((keyword) => code.includes(keyword));
    }
}
