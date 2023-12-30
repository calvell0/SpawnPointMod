import { world, system, } from "@minecraft/server";
const JORDAN_NAME = "calvell0";
let jordan;
const overworld = world.getDimension("overworld");
const setJordan = (event) => {
    if (event.player.name === JORDAN_NAME) {
        jordan = event.player;
        world.sendMessage("jordan set");
    }
    else
        console.log("not jordan");
};
const handlePlayerEvent = (event) => {
    if (event.source != jordan) {
        return;
    }
    let rand = Math.random();
    const MAX_TIMEOUT_TICKS = 10000;
    let randomTimeout = Math.round(Math.random() * MAX_TIMEOUT_TICKS);
    if (rand <= 0.5) {
        system.runTimeout(fuckWithJordan, 0);
    }
};
const fuckWithJordan = () => {
    const jordanLocation = jordan.getHeadLocation();
    const parrotSpawnLocation = getRandomNewLocation(jordanLocation);
    const newParrot = overworld.spawnEntity("minecraft:parrot", parrotSpawnLocation);
    world.sendMessage("parrot spawned");
    const jordanScaleComponent = jordan.getComponent("scale");
    jordanScaleComponent.value = 0.5;
};
const getRandomNewLocation = (coordinates, maxDistance = 15) => {
    coordinates.x += Math.round(Math.random() * (maxDistance * 2)) - maxDistance;
    coordinates.z += Math.round(Math.random() * (maxDistance * 2)) - maxDistance;
    return coordinates;
};
world.afterEvents.playerSpawn.subscribe(setJordan); //check if newly joining players are jordan
world.afterEvents.buttonPush.subscribe(handlePlayerEvent);

//# sourceMappingURL=../../_cottaDebug/main.js.map
