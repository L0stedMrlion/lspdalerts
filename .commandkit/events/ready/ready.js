import { ActivityType } from "discord.js";

//#region src/app/events/ready/ready.ts
var ready_default = (c, client, handler) => {
	console.log(`✅ ${c.user.tag} is online.`);
	client.user.setActivity({
		name: `🚨 All alerts`,
		type: ActivityType.Listening
	});
};

//#endregion
export { ready_default as default };
//# sourceMappingURL=ready.js.map