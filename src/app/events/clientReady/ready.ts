import { ActivityType, Client } from "discord.js";
import type { EventHandler } from 'commandkit';

const handler: EventHandler<'clientReady'> = (client) => {
    client.user.setActivity({
    name: `🚨 All alerts`,
    type: ActivityType.Listening,
  });
};

export default handler;