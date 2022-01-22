const github = require("@actions/github");
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
      .crawl(".")
      .sync();

    const github_token = core.getInput("GITHUB_TOKEN");

    console.log("Process",process.env)
    console.log(github)
    const context = github.context;
    console.log(github.context)
    if (context.payload.pull_request == null) {
      core.setFailed("No pull request found.");
      return;
    }
    const pull_request_number = context.payload.pull_request.number;

    const octokit = new github.GitHub(github_token);
    octokit.issues.createComment({
      ...context.repo,
      issue_number: pull_request_number,
      body: `Total files are ${files.length}`,
    });

    console.log("test compltee", files.length);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
