import {
  ChatSendBeforeEvent,
  DimensionLocation,
  Entity,
  EntityDieAfterEvent,
  Player, PlayerBreakBlockBeforeEvent,
  PlayerSpawnAfterEvent,
  system,
  Vector3,
  world, WorldInitializeAfterEvent
} from "@minecraft/server";

import CommandReader from "./CommandReader";
import { getRandomNewLocation } from "./resources/Utilities";
import PlayerInterface from "./PlayerInterface";
import SecretEventService from "./SecretEventService";

/***************** Global Variables ***********************/
const reader: CommandReader = CommandReader.getReader();
const shenService: SecretEventService = SecretEventService.getShenaniganService();
/**********************************************************/

String.prototype.equalsIgnoreCase = function(this: string, compareTo: string):boolean {
  return this.valueOf().toLowerCase() === compareTo.toLowerCase();
}

world.afterEvents.playerSpawn.subscribe(PlayerInterface.handlePlayerLoad);
world.beforeEvents.playerLeave.subscribe(shenService.handlePlayerLeave);
world.afterEvents.playerSpawn.subscribe(shenService.identifyPlayerTargetOnSpawn); //check if newly joining players are jordan

world.afterEvents.playerInteractWithBlock.subscribe(shenService.handleBlockInteract);

world.beforeEvents.chatSend.subscribe(reader.handleChatEvents);
world.beforeEvents.playerBreakBlock.subscribe(shenService.handleBlockBreak);




