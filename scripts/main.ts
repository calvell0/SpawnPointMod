import {
  ButtonPushAfterEvent,
  ChatSendBeforeEvent,
  DimensionLocation,
  Entity,
  EntityDieAfterEvent,
  Player, PlayerBreakBlockBeforeEvent,
  PlayerSpawnAfterEvent,
  system,
  Vector3,
  world,
} from "@minecraft/server";

import CommandReader from "./CommandReader";
import { getRandomNewLocation } from "./resources/Utilities";
import PlayerInterface from "./PlayerInterface";

/***************** Global Variables ***********************/
const JORDAN_NAME: string = "FlapJackFam";
let jordan: Player;
const overworld = world.getDimension("overworld");
const reader: CommandReader = CommandReader.getReader();
/**********************************************************/

String.prototype.equalsIgnoreCase = function(this: string, compareTo: string):boolean {
  return this.valueOf().toLowerCase() === compareTo.toLowerCase();
}

const handlePlayerLoad = (event: PlayerSpawnAfterEvent) => {
  if (!event.initialSpawn){
    return;
  }
  // PlayerInterface.setTitle(event.player, "Welcome, Sack Chaser!");
  system.runTimeout(() => {
    event.player.sendMessage("Type §3!setspawn §fin chat to set a secondary spawn point. You'll be able to select which point to spawn from after dying.\"")
  }, 50);
  if (event.player.name !== JORDAN_NAME) return;
  jordan = event.player;
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

};

const onBlockBreak = (event: PlayerBreakBlockBeforeEvent) => {
  const { player }: {player: Player} = event;
  if(player.name !== JORDAN_NAME){
    return
  }

  const newrng = Math.random();
  if (newrng < 0.01){
    let rng = Math.random() * 9;
    rng = Math.floor(rng);
    player.selectedSlot = rng;
  }
}









world.afterEvents.playerSpawn.subscribe(handlePlayerLoad); //check if newly joining players are jordan

world.afterEvents.buttonPush.subscribe(handlePlayerEvent);

world.beforeEvents.chatSend.subscribe(reader.handleChatEvents);
world.beforeEvents.playerBreakBlock.subscribe(onBlockBreak);




