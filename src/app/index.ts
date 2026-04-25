import "dotenv/config";
import { Client, IntentsBitField } from "discord.js";
import { commandkit } from "commandkit";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

commandkit.setClient(client);

if (process.env.COMMANDKIT_IS_CLI === "true") {
  commandkit.start();
}
