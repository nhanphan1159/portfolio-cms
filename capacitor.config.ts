import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.nhanphan.portfoliocms",
  appName: "Portfolio CMS",
  webDir: "dist",
  plugins: {
    FirebaseAuthentication: {
      providers: ["google.com"],
      skipNativeAuth: true,
    },
  },
  ios: {
    contentInset: "always",
  },
};

export default config;
