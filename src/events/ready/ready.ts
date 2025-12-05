import { ActivityType, Client } from "discord.js";
import { CommandKit } from "commandkit";

export default (c: Client<true>, client: Client<true>, handler: CommandKit) => {
  console.log(`✅ ${c.user.tag} is online.`);

  const statuses = [
    { name: `🚨 All alerts`, type: ActivityType.Watching },
    { name: `🥷 Metro alerts`, type: ActivityType.Watching },
    { name: `⚠️ Service disruptions`, type: ActivityType.Watching },
    { name: `🕵️ Detective alerts`, type: ActivityType.Watching },
  ];

  let currentIndex = 0;

  client.user.setActivity(statuses[currentIndex]);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % statuses.length;
    client.user.setActivity(statuses[currentIndex]);
  }, 30000);
};

