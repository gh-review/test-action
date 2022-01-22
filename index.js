const core = require("@actions/core");
const { fdir } = require("fdir");
const EXCLUDED_FOLDERS = ["node_modules", "cypress"];

async function run() {
  try {
    const files = new fdir()
      .withBasePath()
      .withFullPaths()
      .exclude((dirName) => EXCLUDED_FOLDERS.includes(dirName))
      .glob("./**/*.js")
      .filter(
        (path) => !(path.endsWith(".test.js") || path.endsWith(".spec.js"))
      )
      .crawl(".")
      .sync();


    console.log("test compltee", files.length);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
