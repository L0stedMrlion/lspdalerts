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

const { Detective_ALERT_RECIPIENTS } = config;

export const data: CommandData = {
  name: "alertdetectives",
  description: "Send Detective Alert to all designated users via DM",
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
    `# 🕵️ Detective Alert\nTím jste obdržel/a Detective Alert z důvodu, že **${reason}**.\n\nInformace, které jste obdržel/a nikomu **nesdělujte!** V případě, že jste dostupný/á tak prosím neprodleně respondujte.\n\nAlert byl zaslán od <@${interaction.user.id}>`
  );

  const thumbnailComponent = new ThumbnailBuilder({
    media: {
      url: "https://cdn.discordapp.com/attachments/1287133753356980329/1369780833501839381/detectivebureau-removebg-preview.png?ex=681d1b50&is=681bc9d0&hm=b7245525798fc72b5dc6004d9f5f7e35917ae9067ed8eb0b51e9ada273d2231e&",
    },
  });

  const sectionComponent = new SectionBuilder()
    .addTextDisplayComponents(textComponent)
    .setThumbnailAccessory(thumbnailComponent);

  for (const userId of Detective_ALERT_RECIPIENTS) {
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

  await interaction.reply({
    content: `✅ Detective Alert sent to ${successCount} users${
      failCount > 0 ? ` (Failed to send to ${failCount} users)` : ""
    }.`,
    flags: MessageFlags.Ephemeral,
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
