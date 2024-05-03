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
        description: "This extension strengthens your online security by analyzing websites for phishing scams.",
        version: "1.0.0",
        manifest_version: 3,
        permissions: ["storage", "activeTab"],
        content_scripts: [
          {
            matches: ["*://*/*"],
            js: ["scripts/content.ts"]
          }
        ],
        background: {
          service_worker: "scripts/background.ts",
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
