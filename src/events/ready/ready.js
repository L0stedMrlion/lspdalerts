const { ActivityType } = require("discord.js");

module.exports = (c, client, handler) => {
  console.log(`✅ ${c.user.tag} is online.`);
  client.user.setActivity({
    name: `🚨 All alerts`,
    type: ActivityType.Watching,
  });
};
