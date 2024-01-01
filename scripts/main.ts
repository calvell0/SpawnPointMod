import {
  ButtonPushAfterEvent,
  ChatSendBeforeEvent,
  DimensionLocation,
  Entity,
  EntityDieAfterEvent,
  Player,
  PlayerSpawnAfterEvent,
  system,
  Vector3,
  world,
} from "@minecraft/server";
import { MessageFormData, MessageFormResponse } from "@minecraft/server-ui";
import CommandReader from "./CommandReader";

/***************** Global Variables ***********************/
const JORDAN_NAME: string = "calvell0";
let jordan: Player;
const overworld = world.getDimension("overworld");
const reader: CommandReader = CommandReader.getCommandReader();
/**********************************************************/

String.prototype.equalsIgnoreCase = function(this: string, compareTo: string):boolean {
  return this.valueOf().toLowerCase() === compareTo.toLowerCase();
}

const setJordan = (event: PlayerSpawnAfterEvent) => {
  if (!event.initialSpawn || event.player.name !== JORDAN_NAME) {
    return;
  }
  jordan = event.player;
};

const sendUserInstructions = (event: PlayerSpawnAfterEvent) => {
  if (!event.initialSpawn) {
    return;
  }

  world.sendMessage(
    "Type !set in chat to set a secondary spawn point. You'll be able to select which point to spawn from after dying."
  );
};

const handlePlayerEvent = (event: ButtonPushAfterEvent) => {
  if (event.source != jordan) {
    return;
  }

  let rand = Math.random();
  const MAX_TIMEOUT_TICKS = 10000;
  let randomTimeout: number = Math.round(Math.random() * MAX_TIMEOUT_TICKS);
  if (rand <= 0.5) {
    system.runTimeout(fuckWithJordan, randomTimeout);
  }
};

const fuckWithJordan = () => {
  const jordanLocation = jordan.getHeadLocation();
  const parrotSpawnLocation = getRandomNewLocation(jordanLocation);

  const newParrot: Entity = overworld.spawnEntity("minecraft:parrot", parrotSpawnLocation);
  world.sendMessage("parrot spawned");
};

const getRandomNewLocation = (coordinates: Vector3, maxDistance: number = 15): Vector3 => {
  coordinates.x += Math.round(Math.random() * (maxDistance * 2)) - maxDistance;
  coordinates.z += Math.round(Math.random() * (maxDistance * 2)) - maxDistance;
  return coordinates;
};






world.afterEvents.playerSpawn.subscribe(setJordan); //check if newly joining players are jordan
world.afterEvents.playerSpawn.subscribe(sendUserInstructions);

world.afterEvents.buttonPush.subscribe(handlePlayerEvent);

world.beforeEvents.chatSend.subscribe(reader.handleChatEvents);

