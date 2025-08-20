const METRO_ALERT_RECIPIENTS = [
  "710549603216261141", // Mrlion
  "769892516152999957", // Petr
  "1127193593023582308", // asi_tade
  "1025072087548821625", // Iamanti
  "909006358928580649", // tickly
  "1102635783095066705", // studiosmile
  "282485014120235008", // fjury
  "813676593968709642", // adambzonek
  "752526572841599107", // maty
  "764121947851456512", // martqx
  "824562833551261706", // lemon
  "1355789979032358952", // tobi
  "427439278382120973", // Tomcaik
  "888762155434909716", // Aertic
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
    name: "alertmetro",
    description: "Send Metro Alert to all designated users via DM",
  },
  run: async ({ interaction, client, handler }) => {
    const GUILD_ID = "1350602855798669382";
    const ALLOWED_ROLE_IDS = [
      "1350606971954266184",
      "1350606847069130752",
      "1350607131006468198",
      "1353441276925837363",
    ];

    const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
    if (!guild)
      return interaction.reply({
        content: "❌ Cannot access the guild.",
        ephemeral: true,
      });

    const member = await guild.members
      .fetch(interaction.user.id)
      .catch(() => null);
    if (!member)
      return interaction.reply({
        content: "❌ You are not a member of the guild.",
        ephemeral: true,
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

    const modal = new ModalBuilder()
      .setCustomId("metro-alert-modal")
      .setTitle("Metro Alert");

    const reasonInput = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Reason for Metro Alert")
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(1000)
      .setPlaceholder("Enter the reason for this Metro Alert...")
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);

    const filter = (i) => i.customId === "metro-alert-modal";
    try {
      const submission = await interaction.awaitModalSubmit({
        filter,
        time: 60000,
      });

      const reason = submission.fields.getTextInputValue("reason");

      let successCount = 0;
      let failCount = 0;

      const textComponent = new TextDisplayBuilder().setContent(
        `# 🥷 Metro Alert\nTím jste obdržel/a Metro Alert z důvodu, že **${reason}**.\n\nInformace, které jste obdržel/a nikomu **nesdělujte!** V případě, že jste dostupný/á tak prosím neprodleně respondujte.\n\nAlert byl zaslán od <@${interaction.user.id}>`
      );

      const button = new ButtonBuilder()
        .setLabel("🦁 Připojit se na Lion Police RP")
        .setStyle(ButtonStyle.Link)
        .setURL("https://cfx.re/join/z84ej5");

      const thumbnailComponent = new ThumbnailBuilder({
        media: {
          url: "https://cdn.discordapp.com/attachments/1287133753356980329/1369776850716328086/hqdefault-removebg-preview.png?ex=681d179a&is=681bc61a&hm=7d099e07be279adc9bd83cf4d373eedc015bc13ef003b4bd2eceb12a0f8da5de&",
        },
      });

      const actionRow = new ActionRowBuilder().addComponents(button);

      const sectionComponent = new SectionBuilder()
        .addTextDisplayComponents(textComponent)
        .setThumbnailAccessory(thumbnailComponent);

      for (const userId of METRO_ALERT_RECIPIENTS) {
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
        content: `✅ Metro Alert sent to ${successCount} users${
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


