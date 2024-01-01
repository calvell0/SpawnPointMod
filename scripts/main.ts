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

/***************** Global Variables ***********************/
const JORDAN_NAME: string = "calvell0";
let jordan: Player;
const overworld = world.getDimension("overworld");
const secondaryPlayerSpawns: Map<string, DimensionLocation> = new Map();
const playerSpawnsToMonitor: Map<string, Vector3> = new Map();
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
      break;
    default:
      return;
  }
};

const handleSetCommand = (event: ChatSendBeforeEvent) => {
  const player = event.sender.id;
  const playerLocation = event.sender.getHeadLocation();

  secondaryPlayerSpawns.set(player, vector3ToDimensionLocation(playerLocation));
  world.sendMessage("new spawn set: " + secondaryPlayerSpawns.get(player));
};

const vector3ToDimensionLocation = (vec: Vector3): DimensionLocation  => {

  let x = Math.round(vec.x);
  let y = Math.round(vec.y);
  let z = Math.round(vec.z);
  let dimension = world.getDimension("overworld");
  return { x, y, z, dimension } as DimensionLocation;
};

const handleDie = (event: EntityDieAfterEvent) => {
  let secondSpawn: DimensionLocation | undefined;
  if (!(secondSpawn = secondaryPlayerSpawns.get(event.deadEntity.id))) {
    return;
  }

  secondSpawn = secondSpawn as DimensionLocation;

  const player = event.deadEntity as Player;
  const { x: x1, y: y1, z: z1 } = player.getSpawnPoint() || world.getDefaultSpawnLocation();
  const { x: x2, y: y2, z: z2 } = secondaryPlayerSpawns.get(player.id) || world.getDefaultSpawnLocation();
  const messageForm = new MessageFormData()
    .title("Select a spawn point:")
    .body(`Original spawn: ${x1}, ${64}, ${z1} \n Secondary spawn point: ${x2}, ${y2}, ${z2}`)
    .button1(`Original spawn`)
    .button2(`Secondary spawn`);

  messageForm.show(player).then((formData: MessageFormResponse) => {
    if (formData.selection === 0 || !formData.selection) {
      return;
    }
    let originalPlayerSpawn: DimensionLocation | undefined;
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
}

const handleSpawnAfterUsingSecondary = (event: PlayerSpawnAfterEvent) => {
  const player = event.player;
  world.sendMessage("spawnAfterEvent triggered");
  if (!playerSpawnsToMonitor.has(player.id)){
    return;
  }


  let tempOriginalSpawn: Vector3 = playerSpawnsToMonitor.get(player.id) as Vector3;
  const originalSpawn: DimensionLocation = vector3ToDimensionLocation(tempOriginalSpawn);


  system.runTimeout(() => {
    player.setSpawnPoint(originalSpawn);
    world.sendMessage(`set original spawn: ${originalSpawn.x}, ${originalSpawn.z} for player: ${player.name}`)
  }, 100);
  playerSpawnsToMonitor.delete(player.id);

  if (playerSpawnsToMonitor.size === 0){
    world.afterEvents.playerSpawn.unsubscribe(handleSpawnAfterUsingSecondary);
  }
}

world.afterEvents.playerSpawn.subscribe(setJordan); //check if newly joining players are jordan
world.afterEvents.playerSpawn.subscribe(sendUserInstructions);

world.afterEvents.buttonPush.subscribe(handlePlayerEvent);

world.beforeEvents.chatSend.subscribe(handleChatEvents);

world.afterEvents.entityDie.subscribe(handleDie);
