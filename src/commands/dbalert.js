const Detective_ALERT_RECIPIENTS = [
  "735501561819824218", // Gariffi
  "710549603216261141", // Mrlion
  "769892516152999957", // petrpetr
  "980537680586739732", // Rákos
  "888762155434909716", // Aertic
  "432501487361327114", // Dezzy
];

const {
  SlashCommandBuilder,
  MessageFlags,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SectionBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alertdetectives")
    .setDescription("Send Detective Alert to all designated users via DM")
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for Detective Alert")
        .setRequired(true)
    ),

  run: async ({ interaction, client }) => {
    const reason = interaction.options.getString("reason");

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
  },
  options: {
    devOnly: false,
    deleted: false,
  },
};

