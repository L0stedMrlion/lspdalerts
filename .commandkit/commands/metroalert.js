import { SectionBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { MessageFlags } from "discord-api-types/v10";

//#region src/app/commands/metroalert.ts
const GUILD_ID = "1350602855798669382";
const METRO_ROLE_ID = "1467806169220513852";
const ALLOWED_ROLE_IDS = [
	"1350606847069130752",
	"1350606971954266184",
	"1350607131006468198",
	"1390949498376945724"
];
const command = {
	name: "alertmetro",
	description: "Send Metro Alert to all users with specific role via DM",
	options: [{
		name: "reason",
		description: "Reason for the Metro Alert",
		type: 3,
		required: true
	}]
};
const chatInput = async (ctx) => {
	const { interaction, client } = ctx;
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });
	const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
	if (!guild) return interaction.editReply({ content: "❌ Cannot access the guild." });
	const member = await guild.members.fetch(interaction.user.id).catch(() => null);
	if (!member) return interaction.editReply({ content: "❌ You are not a member of the guild." });
	if (!member.roles.cache.some((role) => ALLOWED_ROLE_IDS.includes(role.id))) return interaction.editReply({ content: "🚫 You do not have permission to use this command." });
	const reason = interaction.options.getString("reason");
	if (!reason) return interaction.editReply({ content: "❌ Please provide a reason for the alert." });
	const allMembers = await guild.members.fetch().catch(() => null);
	if (!allMembers) return interaction.editReply({ content: "❌ Failed to fetch guild members." });
	const membersWithRole = allMembers.filter((m) => m.roles.cache.has(METRO_ROLE_ID));
	if (membersWithRole.size === 0) return interaction.editReply({ content: "❌ No users found with the specified role." });
	let successList = [];
	let failCount = 0;
	const senderMember = interaction.member;
	const senderName = (senderMember && "displayName" in senderMember ? senderMember.displayName : (senderMember === null || senderMember === void 0 ? void 0 : senderMember.nick) || interaction.user.displayName || interaction.user.username).replace(/^\s*\[.*?\]\s*/, "").replace(/\s*\[.*?\]\s*$/, "").replace(/\s*\(.*?\)$/, "").trim();
	const textComponent = new TextDisplayBuilder().setContent(`# 🥷 Metro Alert\nZdravím.\n\nTímto jste obdržel/a Metro Alert z důvodu, že **${reason}**.\n\nInformace, které jste obdržel/a nikomu **nesdělujte!** V případě, že jste dostupný/á tak prosím neprodleně respondujte.\n\nAlert byl zaslán od **${senderName}** <@${interaction.user.id}>`);
	const thumbnailComponent = new ThumbnailBuilder({ media: { url: "https://cdn.discordapp.com/attachments/1287133753356980329/1369776850716328086/hqdefault-removebg-preview.png?ex=681d179a&is=681bc61a&hm=7d099e07be279adc9bd83cf4d373eedc015bc13ef003b4bd2eceb12a0f8da5de&" } });
	const sectionComponent = new SectionBuilder().addTextDisplayComponents(textComponent).setThumbnailAccessory(thumbnailComponent);
	for (const [userId, targetMember] of membersWithRole) try {
		await targetMember.send({
			flags: MessageFlags.IsComponentsV2,
			components: [sectionComponent]
		});
		successList.push(`<@${userId}>`);
	} catch (error) {
		console.error(`Failed to send DM to user ${userId}:`, error);
		failCount++;
	}
	const resultMessage = `✅ Metro Alert sent to ${successList.length} users:\n${successList.join(", ")}${failCount > 0 ? `\n\n(Failed to send to ${failCount} users).` : ""}`;
	await interaction.editReply({ content: resultMessage.length > 2e3 ? resultMessage.substring(0, 1997) + "..." : resultMessage });
};
const metadata = {
	guilds: [],
	aliases: [],
	userPermissions: [],
	botPermissions: []
};

//#endregion
export { chatInput, command, metadata };
//# sourceMappingURL=metroalert.js.map