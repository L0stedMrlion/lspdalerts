import { defineConfig } from "commandkit";

export default defineConfig({
  commands: "src/app/commands",
  events: "src/app/events",
  plugins: [],
  devGuildIds: [],
  devUserIds: ["710549603216261141"],
  bulkRegister: true,
});
