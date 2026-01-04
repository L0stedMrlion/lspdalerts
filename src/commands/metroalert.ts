import {
  MessageFlags,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SectionBuilder,
} from "discord.js";
import type {
  CommandData,
  SlashCommandProps,
  CommandOptions,
} from "commandkit";
import config from "../config.json";

const { METRO_ALERT_RECIPIENTS, GUILD_ID, ALLOWED_ROLE_IDS } = config;

export const data: CommandData = {
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

export async function run({ interaction, client }: SlashCommandProps) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
  if (!guild)
    return interaction.reply({
      content: "❌ Cannot access the guild.",
      flags: MessageFlags.Ephemeral,
    });

  const member = await guild.members
    .fetch(interaction.user.id)
    .catch(() => null);
  if (!member)
    return interaction.reply({
      content: "❌ You are not a member of the guild.",
      flags: MessageFlags.Ephemeral,
    });

  const hasPermission = member.roles.cache.some((role) =>
    ALLOWED_ROLE_IDS.includes(role.id)
  );
  if (!hasPermission) {
    return interaction.reply({
      content: "🚫 You do not have permission to use this command.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const reason = interaction.options.getString("reason");

  if (!reason) {
    return interaction.reply({
      content: "❌ Please provide a reason for the alert.",
      flags: MessageFlags.Ephemeral,
    });
  }

  let successCount = 0;
  let failCount = 0;

  const textComponent = new TextDisplayBuilder().setContent(
    `# 🥷 Metro Alert\nTím jste obdržel/a Metro Alert z důvodu, že **${reason}**.\n\nInformace, které jste obdržel/a nikomu **nesdělujte!** V případě, že jste dostupný/á tak prosím neprodleně respondujte.\n\nAlert byl zaslán od <@${interaction.user.id}>`
  );

  const thumbnailComponent = new ThumbnailBuilder({
    media: {
      url: "https://cdn.discordapp.com/attachments/1287133753356980329/1369776850716328086/hqdefault-removebg-preview.png?ex=681d179a&is=681bc61a&hm=7d099e07be279adc9bd83cf4d373eedc015bc13ef003b4bd2eceb12a0f8da5de&",
    },
  });

  const sectionComponent = new SectionBuilder()
    .addTextDisplayComponents(textComponent)
    .setThumbnailAccessory(thumbnailComponent);

  for (const userId of METRO_ALERT_RECIPIENTS) {
    try {
      const user = await client.users.fetch(userId);
      await user.send({
        flags: MessageFlags.IsComponentsV2,
        components: [sectionComponent],
      });
      successCount++;
    } catch (error) {
      console.error(`Failed to send DM to user ${userId}:`, error);
      failCount++;
    }
  }

  await interaction.editReply( `✅ Metro Alert sent to ${successCount} users${
      failCount > 0 ? ` (Failed to send to ${failCount} users).` : ""
    }`);  
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
