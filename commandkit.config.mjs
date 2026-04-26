import { defineConfig } from "commandkit";

export default defineConfig({
  commands: "src/app/commands",
  eventsPath: path.join(__dirname, 'events'),
  plugins: [],
  devGuildIds: [],
  devUserIds: ["710549603216261141"],
  bulkRegister: true,
});
