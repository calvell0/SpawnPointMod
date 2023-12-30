import {
  world,
  system,
  EntityHealthChangedAfterEvent,
  EntityHealthChangedAfterEventSignal,
  Player,
  PlayerJoinAfterEvent,
  PlayerJoinAfterEventSignal,
  PlayerSpawnAfterEvent,
  ButtonPushAfterEvent,
  Vector3,
  Entity,
  EntityScaleComponent,
  ChatSendBeforeEvent,
  EntityDieAfterEvent,
  DimensionLocation,
} from "@minecraft/server";
import { MessageFormData, MessageFormResponse } from "@minecraft/server-ui";

/***************** Global Variables ***********************/
const JORDAN_NAME: string = "calvell0";
let jordan: Player;
const overworld = world.getDimension("overworld");
const secondaryPlayerSpawns: Map<string, Vector3> = new Map();
/**********************************************************/

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

const handleChatEvents = (event: ChatSendBeforeEvent) => {
  const chat = event.message;

  if (!chat.startsWith("!")) {
    return;
  }

  let command = chat.split(" ");

  switch (command[0]) {
    case "!set":
      handleSetCommand(event);
    default:
      return;
  }
};

const handleSetCommand = (event: ChatSendBeforeEvent) => {
  const player = event.sender.id;
  const playerLocation = event.sender.getHeadLocation();
  secondaryPlayerSpawns.set(player, playerLocation);
};

const vector3ToDimensionLocation = (vec: Vector3 | undefined): DimensionLocation | undefined => {
  if (!vec) return undefined;
  let x = vec.x;
  let y = vec.y;
  let z = vec.z;
  let dimension = world.getDimension("overworld");
  return { x, y, z, dimension } as DimensionLocation;
};

const handleDie = (event: EntityDieAfterEvent) => {
  if (!secondaryPlayerSpawns.has(event.deadEntity.id)) {
    return;
  }

  const player = event.deadEntity as Player;
  const messageForm = new MessageFormData()
    .title("Select a spawn point:")
    .button1(`Original spawn: ${player.getSpawnPoint()}`)
    .button2(`Secondary spawn point: ${secondaryPlayerSpawns.get(player.id)}`);

  messageForm.show(player).then((formData: MessageFormResponse) => {
    if (formData.selection === 0 || !formData.selection) {
      return;
    }
    let spawn: DimensionLocation | undefined;
    if (!(spawn = player.getSpawnPoint())) {
      console.log("weird error wtf");
      return;
    }

    let newLocation = vector3ToDimensionLocation(secondaryPlayerSpawns.get(player.id));
    player.setSpawnPoint(newLocation);
    system.runTimeout(() => {
      player.setSpawnPoint(spawn);
    }, 100);
  });
};

world.afterEvents.playerSpawn.subscribe(setJordan); //check if newly joining players are jordan
world.afterEvents.playerSpawn.subscribe(sendUserInstructions);

world.afterEvents.buttonPush.subscribe(handlePlayerEvent);

world.beforeEvents.chatSend.subscribe(handleChatEvents);

world.afterEvents.entityDie.subscribe(handleDie);
