import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import webExtension from "@samrum/vite-plugin-web-extension"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    webExtension({
      manifest: {
        name: "Scam Block",
        description: "This Chrome extension is designed to protect you from falling victim to phishing scams. It works by analyzing the websites you visit and warning you of any potential threats, helping keep your personal information secure.",
        version: "1.0.0",
        manifest_version: 3,
        host_permissions: ["*://*/*"],
        permissions: ["storage"],
        content_scripts: [
          {
            matches: ["*://*/*"],
            js: ["src/scripts/content.ts"]
          }
        ],
        background: {
          service_worker: "src/scripts/background.ts",
          type: "module"
        },
        icons: {
          "16": "assets/Icon-16x16.png",
          "32": "assets/Icon-32x32.png",
          "48": "assets/Icon-48x48.png",
          "128": "assets/Icon-128x128.png"
        }
      }
    })
  ]
})
