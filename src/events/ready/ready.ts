import { ActivityType, Client } from "discord.js";
import { CommandKit } from "commandkit";

export default (c: Client<true>, client: Client<true>, handler: CommandKit) => {
  console.log(`✅ ${c.user.tag} is online.`);

  const statuses = [
    { name: `🚨 All alerts`, type: ActivityType.Watching },
    { name: `🚇 Metro updates`, type: ActivityType.Watching },
    { name: `⚠️ Service disruptions`, type: ActivityType.Listening },
    { name: `🚦 Traffic alerts`, type: ActivityType.Watching },
    { name: `📍 Your commute`, type: ActivityType.Watching },
    { name: `� Real-time notifications`, type: ActivityType.Listening },
    { name: `🗺️ Transit status`, type: ActivityType.Playing },
    { name: `🚉 Station updates`, type: ActivityType.Watching },
  ];

  let currentIndex = 0;

  client.user.setActivity(statuses[currentIndex]);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % statuses.length;
    client.user.setActivity(statuses[currentIndex]);
  }, 30000);
};
