const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const { hasPermission } = require("../utils/permissions");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alert")
    .setDescription("Send an alert to a designated group of users.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of alert to send.")
        .setRequired(true)
        .addChoices(
          { name: "Detective", value: "detective" },
          { name: "Metro", value: "metro" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the alert.")
        .setRequired(true)
    ),

  run: async ({ interaction, client }) => {
    const alertType = interaction.options.getString("type");
    const reason = interaction.options.getString("reason");

    if (!(await hasPermission(interaction))) {
      return interaction.reply({
        content: "🚫 You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    let config;
    try {
      const configPath = path.join(__dirname, "../config.json");
      const data = await fs.readFile(configPath, "utf8");
      config = JSON.parse(data);
    } catch (error) {
      console.error("Failed to read or parse config.json:", error);
      return interaction.reply({
        content: "❌ An error occurred while loading the configuration.",
        ephemeral: true,
      });
    }

    let recipients;
    let title;
    let thumbnailUrl;

    if (alertType === "detective") {
      recipients = config.Detective_ALERT_RECIPIENTS;
      title = "🕵️ Detective Alert";
      thumbnailUrl =
        "https://cdn.discordapp.com/attachments/1287133753356980329/1369780833501839381/detectivebureau-removebg-preview.png?ex=681d1b50&is=681bc9d0&hm=b7245525798fc72b5dc6004d9f5f7e35917ae9067ed8eb0b51e9ada273d2231e&";
    } else if (alertType === "metro") {
      recipients = config.METRO_ALERT_RECIPIENTS;
      title = "🥷 Metro Alert";
      thumbnailUrl =
        "https://cdn.discordapp.com/attachments/1287133753356980329/1369776850716328086/hqdefault-removebg-preview.png?ex=681d179a&is=681bc61a&hm=7d099e07be279adc9bd83cf4d373eedc015bc13ef003b4bd2eceb12a0f8da5de&";
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(
        `Tím jste obdržel/a ${title} z důvodu, že **${reason}**.\n\nInformace, které jste obdržel/a nikomu **nesdělujte!** V případě, že jste dostupný/á tak prosím neprodleně respondujte.\n\nAlert byl zaslán od <@${interaction.user.id}>`
      )
      .setThumbnail(thumbnailUrl)
      .setColor(alertType === "detective" ? "#0099ff" : "#ff0000");

    let successCount = 0;
    let failCount = 0;

    for (const userId of recipients) {
      try {
        const user = await client.users.fetch(userId);
        await user.send({ embeds: [embed] });
        successCount++;
      } catch (error) {
        console.error(`Failed to send DM to user ${userId}:`, error);
        failCount++;
      }
    }

    await interaction.reply({
      content: `✅ ${title} sent to ${successCount} users${
        failCount > 0 ? ` (Failed to send to ${failCount} users)` : ""
      }.`,
      ephemeral: true,
    });
  },
  options: {
    devOnly: false,
    deleted: false,
  },
};
