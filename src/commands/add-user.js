const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs").promises;
const path = require("path");
const { hasPermission } = require("../utils/permissions");
const { lock, unlock } = require("../utils/lock");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-user")
    .setDescription("Adds a user to an alert list.")
    .addStringOption((option) =>
      option
        .setName("list")
        .setDescription("The list to add the user to.")
        .setRequired(true)
        .addChoices(
          { name: "Detective", value: "Detective_ALERT_RECIPIENTS" },
          { name: "Metro", value: "METRO_ALERT_RECIPIENTS" }
        )
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to add.")
        .setRequired(true)
    ),

  run: async ({ interaction }) => {
    if (!await hasPermission(interaction)) {
      return interaction.reply({
        content: "🚫 You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    const listName = interaction.options.getString("list");
    const user = interaction.options.getUser("user");

    try {
      await lock();
      const configPath = path.join(__dirname, "../config.json");
      const data = await fs.readFile(configPath, "utf8");
      const configData = JSON.parse(data);

      if (configData[listName].includes(user.id)) {
        return interaction.reply({
          content: `User ${user.tag} is already in the ${listName} list.`,
          ephemeral: true,
        });
      }

      configData[listName].push(user.id);
      await fs.writeFile(configPath, JSON.stringify(configData, null, 2));

      interaction.reply({
        content: `User ${user.tag} has been added to the ${listName} list.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Failed to update config.json:", error);
      interaction.reply({
        content: "❌ An error occurred while updating the configuration.",
        ephemeral: true,
      });
    } finally {
      await unlock();
    }
  },
  options: {
    devOnly: false,
    deleted: false,
  },
};
