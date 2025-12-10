import { ActivityType, Client } from "discord.js";
import { CommandKit } from "commandkit";

export default (c: Client<true>, client: Client<true>, handler: CommandKit) => {
  console.log(`✅ ${c.user.tag} is online.`);

  client.user.setActivity({
    name: `🚨 All alerts`,
    type: ActivityType.Listening,
  });
};
