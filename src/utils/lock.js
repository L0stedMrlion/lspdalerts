const lockfile = require("proper-lockfile");
const path = require("path");

const configPath = path.join(__dirname, "../config.json");

async function lock() {
  await lockfile.lock(configPath);
}

async function unlock() {
  await lockfile.unlock(configPath);
}

module.exports = { lock, unlock };
