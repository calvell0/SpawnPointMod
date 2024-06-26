// === CONFIGURABLE VARIABLES

const dev_bpfoldername = "SpawnPointMod_dev";
const bpfoldername = "SpawnPointMod";
const rpfoldername = "SpawnPointMod_dev";
const useMinecraftPreview = false; // Whether to target the "Minecraft Preview" version of Minecraft vs. the main store version of Minecraft
const useMinecraftDedicatedServer = false; // Whether to use Bedrock Dedicated Server - see https://www.minecraft.net/download/server/bedrock
const dedicatedServerPath = "C:/mc/bds/1.19.0/"; // if using Bedrock Dedicated Server, where to find the extracted contents of the zip package
const prod_pack_uuid = "6740c511-810c-4873-94a4-13b488aed931";
const prod_script_uuid = "1ceb1d19-df31-483a-8169-f2cc75db4c31";
// === END CONFIGURABLE VARIABLES

const gulp = require("gulp");
const ts = require("gulp-typescript");
const del = require("del");
const os = require("os");
const spawn = require("child_process").spawn;
const sourcemaps = require("gulp-sourcemaps");
const zip = import("gulp-zip");
const jsonEditor = require("gulp-json-editor");

const worldsFolderName = useMinecraftDedicatedServer ? "worlds" : "minecraftWorlds";

const activeWorldFolderName = useMinecraftDedicatedServer ? "Bedrock level" : dev_bpfoldername + "world";

const mcdir = useMinecraftDedicatedServer
  ? dedicatedServerPath
  : os.homedir() +
  (useMinecraftPreview
    ? "/AppData/Local/Packages/Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe/LocalState/games/com.mojang/"
    : "/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/");

function clean_build(callbackFunction) {
  del([ "build/behavior_packs/", "build/resource_packs/", "build/worlds" ]).then(
    (value) => {
      callbackFunction(); // success
    },
    (reason) => {
      callbackFunction(); // error
    },
  );
}

function copy_behavior_packs() {
  return gulp.src([ "behavior_packs/**/*" ]).pipe(gulp.dest("build/behavior_packs"));
}

function copy_resource_packs() {
  return gulp.src([ "resource_packs/**/*" ]).pipe(gulp.dest("build/resource_packs"));
}

function pack_world() {
  return gulp
    .src("build/worlds/default/**/*")
    .pipe(zip(dev_bpfoldername + ".mcworld"))
    .pipe(gulp.dest("dist"));
}

const copy_content = gulp.parallel(copy_behavior_packs, copy_resource_packs);

function compile_scripts() {
  return gulp
    .src("scripts/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(
      ts({
        module: "esnext",
        moduleResolution: "node",
        lib: [ "esnext", "dom" ],
        strict: true,
        target: "esnext",
        noImplicitAny: true,

      }),
    )
    .pipe(
      sourcemaps.write("../../_" + dev_bpfoldername + "Debug", {
        destPath: dev_bpfoldername + "/scripts/",
        sourceRoot: "./../../../scripts/",
      }),
    )
    .pipe(gulp.dest("build/behavior_packs/" + dev_bpfoldername + "/scripts"));
}

const build = gulp.series(clean_build, copy_content, compile_scripts);
const buildworld = gulp.series(build, copy_world_to_build, copy_bps_to_world_build);

function clean_localmc(callbackFunction) {
  if (!dev_bpfoldername || !dev_bpfoldername.length || dev_bpfoldername.length < 2) {
    console.log("No dev_bpfoldername specified.");
    callbackFunction();
    return;
  }

  del([ mcdir + "development_behavior_packs/" + dev_bpfoldername, mcdir + "development_resource_packs/" + dev_bpfoldername ], {
    force: true,
  }).then(
    (value) => {
      callbackFunction(); // Success
    },
    (reason) => {
      callbackFunction(); // Error
    },
  );
}

function deploy_localmc_behavior_packs() {
  console.log("Deploying to '" + mcdir + "development_behavior_packs/" + dev_bpfoldername + "'");
  return gulp
    .src([ "build/behavior_packs/" + dev_bpfoldername + "/**/*" ])
    .pipe(gulp.dest(mcdir + "development_behavior_packs/" + dev_bpfoldername));
}

function deploy_localmc_resource_packs() {
  return gulp
    .src([ "build/resource_packs/" + rpfoldername + "/**/*" ])
    .pipe(gulp.dest(mcdir + "development_resource_packs/" + rpfoldername));
}

function deploy_prod_build() {
  return gulp
    .src([ "build/behavior_packs/" + dev_bpfoldername + "/**/*" ])
    .pipe(gulp.dest(`${ mcdir }behavior_packs/${ bpfoldername }`));
}

function getTargetWorldPath() {
  return mcdir + worldsFolderName + "/" + activeWorldFolderName;
}

function getTargetConfigPath() {
  return mcdir + "config";
}

function getTargetWorldBackupPath() {
  return "backups/worlds/" + activeWorldFolderName;
}

function getDevConfigPath() {
  return "config";
}

function getDevWorldPath() {
  return "worlds/default";
}

function getDevWorldBackupPath() {
  return "backups/worlds/devdefault";
}

function clean_localmc_world(callbackFunction) {
  console.log("Removing '" + getTargetWorldPath() + "'");

  del([ getTargetWorldPath() ], {
    force: true,
  }).then(
    (value) => {
      callbackFunction(); // Success
    },
    (reason) => {
      callbackFunction(); // Error
    },
  );
}

function clean_localmc_config(callbackFunction) {
  console.log("Removing '" + getTargetConfigPath() + "'");

  del([ getTargetConfigPath() ], {
    force: true,
  }).then(
    (value) => {
      callbackFunction(); // Success
    },
    (reason) => {
      callbackFunction(); // Error
    },
  );
}

function clean_dev_world(callbackFunction) {
  console.log("Removing '" + getDevWorldPath() + "'");

  del([ getDevWorldPath() ], {
    force: true,
  }).then(
    (value) => {
      callbackFunction(); // Success
    },
    (reason) => {
      callbackFunction(); // Error
    },
  );
}

function clean_localmc_world_backup(callbackFunction) {
  console.log("Removing backup'" + getTargetWorldBackupPath() + "'");

  del([ getTargetWorldBackupPath() ], {
    force: true,
  }).then(
    (value) => {
      callbackFunction(); // Success
    },
    (reason) => {
      callbackFunction(); // Error
    },
  );
}

function clean_dev_world_backup(callbackFunction) {
  console.log("Removing backup'" + getDevWorldBackupPath() + "'");

  del([ getTargetWorldBackupPath() ], {
    force: true,
  }).then(
    (value) => {
      callbackFunction(); // Success
    },
    (reason) => {
      callbackFunction(); // Error
    },
  );
}

function backup_dev_world() {
  console.log("Copying world '" + getDevWorldPath() + "' to '" + getDevWorldBackupPath() + "'");
  return gulp
    .src([ getTargetWorldPath() + "/**/*" ])
    .pipe(gulp.dest(getDevWorldBackupPath() + "/worlds/" + activeWorldFolderName));
}

function deploy_localmc_config() {
  console.log("Copying world 'config/' to '" + getTargetConfigPath() + "'");
  return gulp.src([ getDevConfigPath() + "/**/*" ]).pipe(gulp.dest(getTargetConfigPath()));
}

function deploy_localmc_world() {
  console.log("Copying world 'worlds/default/' to '" + getTargetWorldPath() + "'");
  return gulp.src([ getDevWorldPath() + "/**/*" ]).pipe(gulp.dest(getTargetWorldPath()));
}

function ingest_localmc_world() {
  console.log("Ingesting world '" + getTargetWorldPath() + "' to '" + getDevWorldPath() + "'");
  return gulp.src([ getTargetWorldPath() + "/**/*" ]).pipe(gulp.dest(getDevWorldPath()));
}

function backup_localmc_world() {
  console.log("Copying world '" + getTargetWorldPath() + "' to '" + getTargetWorldBackupPath() + "/'");
  return gulp
    .src([ getTargetWorldPath() + "/**/*" ])
    .pipe(gulp.dest(getTargetWorldBackupPath() + "/" + activeWorldFolderName));
}

function copy_world_to_build() {
  return gulp.src([ getDevWorldPath() + "/**/*" ]).pipe(gulp.dest("build/" + getDevWorldPath()));
}

function copy_bps_to_world_build() {
  return gulp
    .src([ "build/behavior_packs/" + dev_bpfoldername + "/**/*" ])
    .pipe(gulp.dest("build/" + getDevWorldPath() + "/behavior_packs/" + dev_bpfoldername + "/"));
}

const deploy_localmc = gulp.series(
  clean_localmc,
  function(callbackFunction) {
    callbackFunction();
  },
  gulp.parallel(deploy_localmc_behavior_packs, deploy_localmc_resource_packs),
);

function create_bp_mcpack() {
  return gulp
    .src([ "build/behavior_packs/" + dev_bpfoldername + "/**/*" ])
    .pipe(zip(dev_bpfoldername + ".mcpack"))
    .pipe(gulp.dest("build/packages/"));
}

function create_rp_mcpack() {
  return gulp
    .src([ "build/resource_packs/" + rpfoldername + "/**/*" ])
    .pipe(zip(rpfoldername + ".mcpack"))
    .pipe(gulp.dest("build/packages/"));
}

function create_mcaddon() {
  return gulp
    .src([ "build/packages/" + dev_bpfoldername + ".mcpack", "build/packages/" + rpfoldername + ".mcpack" ])
    .pipe(zip(dev_bpfoldername + ".mcaddon"))
    .pipe(gulp.dest("build/packages/"));
}

function watch() {
  return gulp.watch(
    [ "scripts/**/*.ts", "behavior_packs/**/*", "resource_packs/**/*" ],
    gulp.series(build, deploy_localmc),
  );
}

function serve() {
  return gulp.watch(
    [ "scripts/**/*.ts", "behavior_packs/**/*", "resource_packs/**/*" ],
    gulp.series(stopServer, build, deploy_localmc, startServer),
  );
}

let activeServer = null;

function stopServer(callbackFunction) {
  if (activeServer) {
    activeServer.stdin.write("stop\n");
    activeServer = null;
  }

  callbackFunction();
}

function startServer(callbackFunction) {
  if (activeServer) {
    activeServer.stdin.write("stop\n");
    activeServer = null;
  }

  activeServer = spawn(dedicatedServerPath + "bedrock_server");

  let logBuffer = "";

  let serverLogger = function(buffer) {
    let incomingBuffer = buffer.toString();

    if (incomingBuffer.endsWith("\n")) {
      (logBuffer + incomingBuffer).split(/\n/).forEach(function(message) {
        if (message) {
          if (message.indexOf("Server started.") >= 0) {
            activeServer.stdin.write("script debugger listen 19144\n");
          }
          console.log("Server: " + message);
        }
      });
      logBuffer = "";
    } else {
      logBuffer += incomingBuffer;
    }
  };

  activeServer.stdout.on("data", serverLogger);
  activeServer.stderr.on("data", serverLogger);

  callbackFunction();
}

function increment_version() {
  return gulp.src("behavior_packs/SpawnPointMod_dev/manifest.json")
    .pipe(jsonEditor((json) => {
      json.header.version[2]++; // Increment the patch version
      if (json.header.version[2] > 99) {
        json.header.version[1]++; // Increment the minor version if patch version > 99
        json.header.version[2] = 0;
      }
      if (json.header.version[1] > 99) {
        json.header.version[0]++; // Increment the major version if minor version > 99
        json.header.version[1] = 0;
      }
      json.modules[0].version = json.header.version;
      return json;
    }, { "end_with_newline": true }))
    .pipe(gulp.dest(`behavior_packs/${ dev_bpfoldername }/`));
}

function modify_manifest_prod() {
  return gulp.src(`behavior_packs/${ dev_bpfoldername }/manifest.json`)
    .pipe(jsonEditor((json) => {
      json.header.name = bpfoldername;
      json.header.uuid = prod_pack_uuid;
      json.modules[0].uuid = prod_script_uuid;
      return json;
    }, { "end_with_newline": true }))
    .pipe(gulp.dest(`${ mcdir }behavior_packs/${ bpfoldername }/`));

}

exports.increment_version = increment_version;
exports.clean_build = clean_build;
exports.copy_behavior_packs = copy_behavior_packs;
exports.copy_resource_packs = copy_resource_packs;
exports.compile_scripts = compile_scripts;
exports.copy_content = copy_content;
exports.build = build;
exports.buildworld = buildworld;
exports.packworld = gulp.series(buildworld, pack_world);
exports.clean_localmc = clean_localmc;
exports.deploy_localmc = deploy_localmc;
exports.default = gulp.series(build, deploy_localmc);
exports.clean = gulp.series(clean_build, clean_localmc);
exports.watch = gulp.series(build, deploy_localmc, watch);
exports.serve = gulp.series(build, deploy_localmc, startServer, serve);
exports.updateworld = gulp.series(
  clean_localmc_world_backup,
  backup_localmc_world,
  clean_localmc_world,
  deploy_localmc_world,
);
exports.deploy_prod_build = deploy_prod_build;
exports.full_build = gulp.series(increment_version, build, deploy_prod_build, modify_manifest_prod);
exports.fb = exports.full_build;
exports.package = gulp.series(build, gulp.parallel(create_bp_mcpack, create_rp_mcpack), create_mcaddon);
exports.ingestworld = gulp.series(clean_dev_world_backup, backup_dev_world, clean_dev_world, ingest_localmc_world);
exports.updateconfig = gulp.series(clean_localmc_config, deploy_localmc_config);