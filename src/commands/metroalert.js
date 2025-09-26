const METRO_ALERT_RECIPIENTS = [
  "710549603216261141", // Mrlion
  "769892516152999957", // petrpetr
  "1127193593023582308", // asi_tade
  "1025072087548821625", // Iamanti
  "909006358928580649", // tickly
  "1102635783095066705", // studiosmile
  "282485014120235008", // fjury
  "813676593968709642", // adambzonek
  "752526572841599107", // matyhomik
  "764121947851456512", // martqx
  "1355789979032358952", // ItsTobi
  "427439278382120973", // Tomcaik
  "888762155434909716", // Aertic
];

const {
  MessageFlags,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SectionBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alertmetro")
    .setDescription("Send Metro Alert to all designated users via DM")
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the Metro Alert")
        .setRequired(true)
    ),
  run: async ({ interaction, client }) => {
    const GUILD_ID = "1350602855798669382";
    const ALLOWED_ROLE_IDS = [
      "1350606971954266184",
      "1350606847069130752",
      "1350607131006468198",
      "1353441276925837363",
      "1390949498376945724",
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

    const reason = interaction.options.getString("reason");

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

    await interaction.reply({
      content: `✅ Metro Alert sent to ${successCount} users${
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

