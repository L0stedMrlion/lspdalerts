import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client, IntentsBitField } from "discord.js";
import { CommandKit } from "commandkit"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Works for both src/app/index.ts and dist/app/index.js
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const commandkit = new CommandKit({ client: client as any });

if (process.env.COMMANDKIT_IS_CLI === "true") {
  commandkit.start();
}