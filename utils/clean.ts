import { $ } from "bun"
import fs from "fs"
import zip from "cross-zip"

await $`cp -r ./src/assets/ ./dist/`

const baseDir = "./dist/assets/scripts/";
const fileList: string[] = fs.readdirSync(baseDir, { "encoding": "utf-8" });

if (fileList.length) {
  const backgroundContent: string = fs.readFileSync(baseDir + fileList[0], "utf-8");

  fs.writeFileSync("./dist/serviceWorker.js", backgroundContent);
  await $`rm ${baseDir}/${fileList[0]}`
  await $`rm -rf ${baseDir}`
  zip.zip("./dist/", "./dist/scam-block.zip")
}