const fs = require("fs");
const path = require("path");

async function hasPermission(interaction) {
  const configPath = path.join(__dirname, "../config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return interaction.member.roles.cache.some((role) =>
    config.ALLOWED_ROLE_IDS.includes(role.id)
  );
}

module.exports = { hasPermission };
