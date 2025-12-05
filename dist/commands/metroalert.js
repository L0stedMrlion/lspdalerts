"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.data = void 0;
exports.run = run;
const discord_js_1 = require("discord.js");
const config_json_1 = __importDefault(require("../config.json"));
const { METRO_ALERT_RECIPIENTS, GUILD_ID, ALLOWED_ROLE_IDS } = config_json_1.default;
exports.data = {
    name: "alertmetro",
    description: "Send Metro Alert to all designated users via DM",
    options: [
        {
            name: "reason",
            description: "Reason for the Metro Alert",
            type: 3,
            required: true,
        },
    ],
};
async function run({ interaction, client }) {
    const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
    if (!guild)
        return interaction.reply({
            content: "❌ Cannot access the guild.",
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
    const member = await guild.members
        .fetch(interaction.user.id)
        .catch(() => null);
    if (!member)
        return interaction.reply({
            content: "❌ You are not a member of the guild.",
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
    const hasPermission = member.roles.cache.some((role) => ALLOWED_ROLE_IDS.includes(role.id));
    if (!hasPermission) {
        return interaction.reply({
            content: "🚫 You do not have permission to use this command.",
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
    }
    const reason = interaction.options.getString("reason");
    if (!reason) {
        return interaction.reply({
            content: "❌ Please provide a reason for the alert.",
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
    }
    let successCount = 0;
    let failCount = 0;
    const textComponent = new discord_js_1.TextDisplayBuilder().setContent(`# 🥷 Metro Alert\nTím jste obdržel/a Metro Alert z důvodu, že **${reason}**.\n\nInformace, které jste obdržel/a nikomu **nesdělujte!** V případě, že jste dostupný/á tak prosím neprodleně respondujte.\n\nAlert byl zaslán od <@${interaction.user.id}>`);
    const thumbnailComponent = new discord_js_1.ThumbnailBuilder({
        media: {
            url: "https://cdn.discordapp.com/attachments/1287133753356980329/1369776850716328086/hqdefault-removebg-preview.png?ex=681d179a&is=681bc61a&hm=7d099e07be279adc9bd83cf4d373eedc015bc13ef003b4bd2eceb12a0f8da5de&",
        },
    });
    const sectionComponent = new discord_js_1.SectionBuilder()
        .addTextDisplayComponents(textComponent)
        .setThumbnailAccessory(thumbnailComponent);
    for (const userId of METRO_ALERT_RECIPIENTS) {
        try {
            const user = await client.users.fetch(userId);
            await user.send({
                flags: discord_js_1.MessageFlags.IsComponentsV2,
                components: [sectionComponent],
            });
            successCount++;
        }
        catch (error) {
            console.error(`Failed to send DM to user ${userId}:`, error);
            failCount++;
        }
    }
    await interaction.reply({
        content: `✅ Metro Alert sent to ${successCount} users${failCount > 0 ? ` (Failed to send to ${failCount} users)` : ""}.`,
        flags: discord_js_1.MessageFlags.Ephemeral,
    });
}
exports.options = {
    devOnly: false,
    deleted: false,
};
