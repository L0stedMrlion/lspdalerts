const Detective_ALERT_RECIPIENTS = [
  "735501561819824218", // Gariffi
  "1274772842696671302", // Lenny
  "710549603216261141", // Mrlion
  "892296560845660212", // pentyyy
  "769892516152999957", // petrpetr
  "980537680586739732", // Rákos
  "621756890610663424", // vojta
];

const {
  MessageFlags,
  TextDisplayBuilder,
  ButtonBuilder,
  ButtonStyle,
  ThumbnailBuilder,
  SectionBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: "alertdetectives",
    description: "Send Detective Alert to all designated users via DM",
  },

  run: async ({ interaction, client, handler }) => {
    const modal = new ModalBuilder()
      .setCustomId("Detective-alert-modal")
      .setTitle("Detective Alert");

    const reasonInput = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Reason for Detective Alert")
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(1000)
      .setPlaceholder("Enter the reason for this Detective Alert...")
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);

    const filter = (i) => i.customId === "Detective-alert-modal";
    try {
      const submission = await interaction.awaitModalSubmit({
        filter,
        time: 60000,
      });

      const reason = submission.fields.getTextInputValue("reason");

      let successCount = 0;
      let failCount = 0;

      const textComponent = new TextDisplayBuilder().setContent(
        `# 🕵️ Detective Alert\nTím jste obdržel/a Detective Alert z důvodu, že **${reason}**.\n\nInformace, které jste obdržel/a nikomu **nesdělujte!** V případě, že jste dostupný/á tak prosím neprodleně respondujte.\n\nAlert byl zaslán od <@${interaction.user.id}>`
      );

      const button = new ButtonBuilder()
        .setLabel("🦁 Připojit se na Lion Police RP")
        .setStyle(ButtonStyle.Link)
        .setURL("https://cfx.re/join/z84ej5");

      const thumbnailComponent = new ThumbnailBuilder({
        media: {
          url: "https://cdn.discordapp.com/attachments/1287133753356980329/1369780833501839381/detectivebureau-removebg-preview.png?ex=681d1b50&is=681bc9d0&hm=b7245525798fc72b5dc6004d9f5f7e35917ae9067ed8eb0b51e9ada273d2231e&",
        },
      });

      const actionRow = new ActionRowBuilder().addComponents(button);

      const sectionComponent = new SectionBuilder()
        .addTextDisplayComponents(textComponent)
        .setThumbnailAccessory(thumbnailComponent);

      for (const userId of Detective_ALERT_RECIPIENTS) {
        try {
          const user = await client.users.fetch(userId);
          await user.send({
            flags: MessageFlags.IsComponentsV2,
            components: [sectionComponent, actionRow],
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to send DM to user ${userId}:`, error);
          failCount++;
        }
      }

      await submission.reply({
        content: `✅ Detective Alert sent to ${successCount} users${
          failCount > 0 ? ` (Failed to send to ${failCount} users)` : ""
        }.`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("Modal submission error:", error);
      if (error.code === "InteractionCollectorError") {
        await interaction.followUp({
          content: "❌ Modal timed out. Please try again.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
  options: {
    devOnly: false,
    deleted: false,
  },
};
