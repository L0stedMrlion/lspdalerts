import "dotenv/config";
import { Client, IntentsBitField } from "discord.js";
import { commandkit } from "commandkit";

//#region src/app/index.ts
const client = new Client({ intents: [
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.MessageContent
] });
commandkit.setClient(client);
if (process.env.COMMANDKIT_IS_CLI === "true") commandkit.start();

//#endregion
export {  };
//# sourceMappingURL=index.js.map