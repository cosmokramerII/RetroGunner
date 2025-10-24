import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cosmokramerii.retrogunner",
  appName: "RetroGunner",
  webDir: "dist",
  bundledWebRuntime: false,
  ios: { scheme: "capacitor" },
};

export default config;
