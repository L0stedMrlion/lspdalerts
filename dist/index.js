"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const commandkit_1 = require("commandkit");
const path_1 = __importDefault(require("path"));
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.MessageContent,
    ],
});
new commandkit_1.CommandKit({
    client,
    commandsPath: path_1.default.join(__dirname, "commands"),
    eventsPath: path_1.default.join(__dirname, "events"),
    devGuildIds: [],
    devUserIds: ["710549603216261141"],
    skipBuiltInValidations: true,
    bulkRegister: true,
});
client.login(process.env.TOKEN);
