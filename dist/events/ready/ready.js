"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = (c, client, handler) => {
    console.log(`✅ ${c.user.tag} is online.`);
    const statuses = [
        { name: `🚨 All alerts`, type: discord_js_1.ActivityType.Watching },
        { name: `🚇 Metro updates`, type: discord_js_1.ActivityType.Watching },
        { name: `⚠️ Service disruptions`, type: discord_js_1.ActivityType.Listening },
        { name: `🚦 Traffic alerts`, type: discord_js_1.ActivityType.Watching },
        { name: `📍 Your commute`, type: discord_js_1.ActivityType.Watching },
        { name: `� Real-time notifications`, type: discord_js_1.ActivityType.Listening },
        { name: `🗺️ Transit status`, type: discord_js_1.ActivityType.Playing },
        { name: `🚉 Station updates`, type: discord_js_1.ActivityType.Watching },
    ];
    let currentIndex = 0;
    client.user.setActivity(statuses[currentIndex]);
    setInterval(() => {
        currentIndex = (currentIndex + 1) % statuses.length;
        client.user.setActivity(statuses[currentIndex]);
    }, 30000);
};
