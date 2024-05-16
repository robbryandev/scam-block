import { $ } from "bun"
import fs from "fs"
import zip from "cross-zip"

async function main() {
  await $`cp -r ./src/assets/ ./dist/`

  const assetDir = "./dist/assets/"
  const baseDir = assetDir + "src/scripts/";
  console.log("moving scripts")
  try {
    console.log("getting content")
    const fileList: string[] = fs.readdirSync(baseDir, { "encoding": "utf-8" });
    const backgroundContent: string = fs.readFileSync(baseDir + fileList[0], "utf-8");

    console.log("setting service worker")
    fs.writeFileSync("./dist/serviceWorker.js", backgroundContent);


    console.log("removing old folders")
    await $`rm -rf ${assetDir}src`
  } catch (error) {
    console.log(error)
  }

  console.log("moving content")
  await $`mv ./dist/src/scripts/ ./dist/`
  await $`rm -rf ./dist/src/`

  console.log("changing manifest")
  const manifestPath = "./dist/manifest.json"
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  manifest.content_scripts[0].js = ["scripts/content.js"];

  fs.writeFileSync(manifestPath, JSON.stringify(manifest));


  console.log("zipping extension")
  zip.zip("./dist/", "./dist/scam-block.zip")
}

await main()