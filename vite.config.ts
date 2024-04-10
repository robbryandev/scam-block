import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import webExtension from "@samrum/vite-plugin-web-extension"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    webExtension({
      manifest: {
        name: "scam block",
        description: "prevent you from getting phished",
        version: "1.0.0",
        manifest_version: 3,
        host_permissions: ["*://*/*"],
        permissions: ["proxy"],
        content_scripts: [
          {
            matches: ["*://*/*"],
            js: ["frontend/scripts/content.ts"]
          }
        ],
        background: {
          service_worker: "frontend/scripts/background.ts",
          type: "module"
        }
      }
    })
  ]
})
