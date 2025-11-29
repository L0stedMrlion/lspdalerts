const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays a list of available commands."),

  run: async ({ interaction, client }) => {
    const embed = new EmbedBuilder()
      .setTitle("Bot Commands")
      .setDescription("Here is a list of all available commands:")
      .setColor("#0099ff")
      .addFields(
        {
          name: "/alert",
          value:
            "Sends an alert to a designated group of users. Requires `type` and `reason` options.",
        },
        {
          name: "/add-user",
          value:
            "Adds a user to an alert list. Requires `list` and `user` options.",
        },
        {
          name: "/remove-user",
          value:
            "Removes a user from an alert list. Requires `list` and `user` options.",
        },
        { name: "/help", value: "Displays this help message." }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
  options: {
    devOnly: false,
    deleted: false,
  },
};
