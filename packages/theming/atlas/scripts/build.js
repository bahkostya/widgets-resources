const concurrently = require("concurrently");
const { join } = require("path");
const { rm, mkdir } = require("shelljs");

main().catch(e => {
    console.error(e);
    process.exit(-1);
});

async function main() {
    const mode = process.argv[2] || "build";

    let outputDir;

    if (mode === "build" || mode === "start") {
        const MX_PROJECT_PATH = process.env.ATLAS_MX_PROJECT_PATH; // should be an absolute path.
        outputDir = MX_PROJECT_PATH ? MX_PROJECT_PATH : join(__dirname, "../tests/testProject");

        const toRemoveDirs = [
            join(outputDir, "theme"),
            join(outputDir, "themesource/atlas_ui_resources"),
            join(outputDir, "themesource/atlas_core"),
            join(outputDir, "themesource/atlas_nativemobile_content"),
            join(outputDir, "themesource/atlas_web_content")
        ];
        rm("-rf", toRemoveDirs);
        console.info(`Ensured the directories ${toRemoveDirs.join(", ")} are removed from your Mendix project`);
    } else if (mode === "release") {
        outputDir = join(__dirname, "../dist");

        rm("-rf", outputDir);
        console.info(`Ensured the directory ${outputDir} is removed`);
    } else {
        throw new Error(`Invalid mode: "${mode}"`);
    }

    // when targeting a networked windows drive, the cmds executed by concurrently run into a race condition when
    // creating directories. create them here to avoid the error.
    mkdir("-p", join(outputDir, "theme"));
    mkdir("-p", join(outputDir, "themesource/atlas_core"));
    mkdir("-p", join(outputDir, "themesource/atlas_web_content"));
    mkdir("-p", join(outputDir, "themesource/atlas_nativemobile_content"));

    await buildAndCopyAtlas(mode === "start", outputDir);
}

async function buildAndCopyAtlas(watchMode, destination) {
    console.info(`Building & copying Atlas...`);
    const watchArg = watchMode ? "--watch" : "";

    try {
        await concurrently(
            [
                {
                    name: "web-theme-content",
                    command: `copy-and-watch ${watchArg} "src/theme/web/**/*" "${join(destination, "theme/web")}"`
                },
                {
                    name: "web-themesource-core",
                    command: `copy-and-watch ${watchArg} "src/themesource/atlas_core/web/**/*" "${join(
                        destination,
                        "themesource/atlas_core/web"
                    )}"`
                },
                {
                    name: "public-themesource-core",
                    command: `copy-and-watch ${watchArg} "src/themesource/atlas_core/public/**/*" "${join(
                      destination,
                      "themesource/atlas_core/public"
                    )}"`
                },
                {
                    name: "web-themesource-content",
                    command: `copy-and-watch ${watchArg} "src/themesource/atlas_web_content/web/**/*" "${join(
                        destination,
                        "themesource/atlas_web_content/web"
                    )}"`
                },
                {
                    name: "public-themesource-content",
                    command: `copy-and-watch ${watchArg} "src/themesource/atlas_web_content/public/**/*" "${join(
                      destination,
                      "themesource/atlas_web_content/public"
                    )}"`
                },
                {
                    name: "native-typescript",
                    command: `tsc ${watchArg} --project tsconfig.json --outDir "${destination}"`
                },
                {
                    name: "native-design-properties-and-manifest",
                    command: `copy-and-watch ${watchArg} "src/themesource/atlas_core/native/**/*.json" "${join(
                        destination,
                        "themesource/atlas_core/native"
                    )}"`
                },
                {
                    name: "public-themesource-nativecontent",
                    command: `copy-and-watch ${watchArg} "src/themesource/atlas_nativemobile_content/public/**/*" "${join(
                      destination,
                      "themesource/atlas_nativemobile_content/public"
                    )}"`
                },
            ],
            {
                killOthers: ["failure"]
            }
        );
        console.log("Building & copying Atlas has completed successfully");
    } catch (commands) {
        const commandInfo = commands.map(command => `{ name: ${command.command.name}, exit code: ${command.exitCode}}`);
        throw new Error(`One or more commands failed:\n${commandInfo.join("\n")}`);
    }
}
