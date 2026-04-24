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

const GUILD_ID = "1313589265195864074";
const DETECTIVE_ROLE_ID = "1320317608494370846";
const ALLOWED_ROLE_IDS = [
  "1350606847069130752",
  "1350606971954266184",
  "1350607131006468198",
  "1390949498376945724",
];

export const data: CommandData = {
  name: "alertdetectives",
  description: "Send Detective Alert to all users with specific role via DM",
  options: [
    {
      name: "reason",
      description: "Reason for Detective Alert",
      type: 3,
      required: true,
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
  if (!guild)
    return interaction.editReply({
      content: "❌ Cannot access the guild.",
    });

  const permissionGuildId = "1350602855798669382";
  const permGuild = await client.guilds
    .fetch(permissionGuildId)
    .catch(() => null);

  const member = permGuild
    ? await permGuild.members.fetch(interaction.user.id).catch(() => null)
    : null;

  if (!member) {
    return interaction.editReply({
      content: "❌ You are not a authorized member of the primary guild.",
    });
  }

  const hasPermission = member.roles.cache.some((role) =>
    ALLOWED_ROLE_IDS.includes(role.id)
  );

  if (!hasPermission) {
    return interaction.editReply({
      content: "🚫 You do not have permission to use this command.",
    });
  }

  const reason = interaction.options.getString("reason");

  if (!reason) {
    return interaction.editReply({
      content: "❌ Please provide a reason for the alert.",
    });
  }

  const allMembers = await guild.members.fetch().catch(() => null);

  if (!allMembers) {
    return interaction.editReply({
      content: "❌ Failed to fetch guild members from the detective guild.",
    });
  }

  const membersWithRole = allMembers.filter((m) =>
    m.roles.cache.has(DETECTIVE_ROLE_ID)
  );

  if (membersWithRole.size === 0) {
    return interaction.editReply({
      content: "❌ No users found with the specified role.",
    });
  }

  let successList: string[] = [];
  let failCount = 0;

  const textComponent = new TextDisplayBuilder().setContent(
    `# 🕵️ Detective Alert\nTím jste obdržel/a Detective Alert z důvodu, že **${reason}**.\n\nInformace, které jste obdržel/a nikomu **nesdělujte!** V případě, že jste dostupný/á tak prosím neprodleně respondujte.\n\nAlert byl zaslán od <@${interaction.user.id}>`
  );

  const thumbnailComponent = new ThumbnailBuilder({
    media: {
      url: "https://cdn.discordapp.com/icons/1313589265195864074/76abd02a3e9bc372eb1a4c597fa9c5a1.webp?size=1024",
    },
  });

  const sectionComponent = new SectionBuilder()
    .addTextDisplayComponents(textComponent)
    .setThumbnailAccessory(thumbnailComponent);

  for (const [userId, targetMember] of membersWithRole) {
    try {
      await targetMember.send({
        flags: MessageFlags.IsComponentsV2,
        components: [sectionComponent],
      });
      successList.push(`<@${userId}>`);
    } catch (error) {
      console.error(`Failed to send DM to user ${userId}:`, error);
      failCount++;
    }
  }

  const resultMessage = `✅ Detective Alert sent to ${successList.length} users:\n${successList.join(", ")}${
    failCount > 0 ? `\n\n(Failed to send to ${failCount} users).` : ""
  }`;

  await interaction.editReply({
    content:
      resultMessage.length > 2000
        ? resultMessage.substring(0, 1997) + "..."
        : resultMessage,
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
