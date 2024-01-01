import { system, world, } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";
/***************** Global Variables ***********************/
const JORDAN_NAME = "calvell0";
let jordan;
const overworld = world.getDimension("overworld");
const secondaryPlayerSpawns = new Map();
const playerSpawnsToMonitor = new Map();
/**********************************************************/
const setJordan = (event) => {
    if (!event.initialSpawn || event.player.name !== JORDAN_NAME) {
        return;
    }
    jordan = event.player;
};
const sendUserInstructions = (event) => {
    if (!event.initialSpawn) {
        return;
    }
    world.sendMessage("Type !set in chat to set a secondary spawn point. You'll be able to select which point to spawn from after dying.");
};
const handlePlayerEvent = (event) => {
    if (event.source != jordan) {
        return;
    }
    let rand = Math.random();
    const MAX_TIMEOUT_TICKS = 10000;
    let randomTimeout = Math.round(Math.random() * MAX_TIMEOUT_TICKS);
    if (rand <= 0.5) {
        system.runTimeout(fuckWithJordan, randomTimeout);
    }
};
const fuckWithJordan = () => {
    const jordanLocation = jordan.getHeadLocation();
    const parrotSpawnLocation = getRandomNewLocation(jordanLocation);
    const newParrot = overworld.spawnEntity("minecraft:parrot", parrotSpawnLocation);
    world.sendMessage("parrot spawned");
};
const getRandomNewLocation = (coordinates, maxDistance = 15) => {
    coordinates.x += Math.round(Math.random() * (maxDistance * 2)) - maxDistance;
    coordinates.z += Math.round(Math.random() * (maxDistance * 2)) - maxDistance;
    return coordinates;
};
const handleChatEvents = (event) => {
    const chat = event.message;
    if (!chat.startsWith("!")) {
        return;
    }
    let command = chat.split(" ");
    switch (command[0]) {
        case "!set":
            handleSetCommand(event);
            break;
        default:
            return;
    }
};
const handleSetCommand = (event) => {
    const player = event.sender.id;
    const playerLocation = event.sender.getHeadLocation();
    secondaryPlayerSpawns.set(player, vector3ToDimensionLocation(playerLocation));
    world.sendMessage("new spawn set: " + secondaryPlayerSpawns.get(player));
};
const vector3ToDimensionLocation = (vec) => {
    let x = Math.round(vec.x);
    let y = Math.round(vec.y);
    let z = Math.round(vec.z);
    let dimension = world.getDimension("overworld");
    return { x, y, z, dimension };
};
const handleDie = (event) => {
    let secondSpawn;
    if (!(secondSpawn = secondaryPlayerSpawns.get(event.deadEntity.id))) {
        return;
    }

    const player = event.deadEntity;
    const { x: x1, y: y1, z: z1 } = player.getSpawnPoint() || world.getDefaultSpawnLocation();
    const { x: x2, y: y2, z: z2 } = secondaryPlayerSpawns.get(player.id) || world.getDefaultSpawnLocation();
    const messageForm = new MessageFormData()
        .title("Select a spawn point:")
        .body(`Original spawn: ${x1}, ${64}, ${z1} \n Secondary spawn point: ${x2}, ${y2}, ${z2}`)
        .button1(`Original spawn`)
        .button2(`Secondary spawn`);
    messageForm.show(player).then((formData) => {
        if (formData.selection === 0 || !formData.selection) {
            return;
        }
        let originalPlayerSpawn;
        if (!(originalPlayerSpawn = player.getSpawnPoint())) {
            originalPlayerSpawn = vector3ToDimensionLocation(world.getDefaultSpawnLocation());
        }
        player.setSpawnPoint(secondSpawn);
        // @ts-ignore
        world.sendMessage(`Set temp spawn: ${secondSpawn.x}, ${secondSpawn.z} for player: ${player.name}`);
        const { x, y, z } = originalPlayerSpawn;
        playerSpawnsToMonitor.set(player.id, { x, y, z });
        world.afterEvents.playerSpawn.subscribe(handleSpawnAfterUsingSecondary);
    });
};
const handleSpawnAfterUsingSecondary = (event) => {
    const player = event.player;
    world.sendMessage("spawnAfterEvent triggered");
    if (!playerSpawnsToMonitor.has(player.id)) {
        return;
    }
    let tempOriginalSpawn = playerSpawnsToMonitor.get(player.id);
    const originalSpawn = vector3ToDimensionLocation(tempOriginalSpawn);
    system.runTimeout(() => {
        player.setSpawnPoint(originalSpawn);
        world.sendMessage(`set original spawn: ${originalSpawn.x}, ${originalSpawn.z} for player: ${player.name}`);
    }, 100);
    playerSpawnsToMonitor.delete(player.id);
    if (playerSpawnsToMonitor.size === 0) {
        world.afterEvents.playerSpawn.unsubscribe(handleSpawnAfterUsingSecondary);
    }
};
world.afterEvents.playerSpawn.subscribe(setJordan); //check if newly joining players are jordan
world.afterEvents.playerSpawn.subscribe(sendUserInstructions);
world.afterEvents.buttonPush.subscribe(handlePlayerEvent);
world.beforeEvents.chatSend.subscribe(handleChatEvents);
world.afterEvents.entityDie.subscribe(handleDie);

//# sourceMappingURL=../../_cottaDebug/main.js.map
