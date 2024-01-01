import { system, world, } from "@minecraft/server";
import CommandReader from "./CommandReader";
/***************** Global Variables ***********************/
const JORDAN_NAME = "calvell0";
let jordan;
const overworld = world.getDimension("overworld");
const reader = CommandReader.getCommandReader();
/**********************************************************/
String.prototype.equalsIgnoreCase = function (compareTo) {
    return this.valueOf().toLowerCase() === compareTo.toLowerCase();
};
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
world.afterEvents.playerSpawn.subscribe(setJordan); //check if newly joining players are jordan
world.afterEvents.playerSpawn.subscribe(sendUserInstructions);
world.afterEvents.buttonPush.subscribe(handlePlayerEvent);
world.beforeEvents.chatSend.subscribe(reader.handleChatEvents);

//# sourceMappingURL=../../_cottaDebug/main.js.map
