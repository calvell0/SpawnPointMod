import { world } from "@minecraft/server";


import { chatEventHandler, eventHandler } from "./services/index";


String.prototype.equalsIgnoreCase = function(this: string, compareTo: string): boolean {
  return this.valueOf().toLowerCase() === compareTo.toLowerCase();
};

world.afterEvents.playerSpawn.subscribe(eventHandler.handlePlayerSpawn);
world.beforeEvents.playerLeave.subscribe(eventHandler.handlePlayerLeave);

world.afterEvents.playerInteractWithBlock.subscribe(eventHandler.handleBlockInteract);
// world.afterEvents.worldInitialize.subscribe(playerTargetManager.refreshActivePlayers);
world.afterEvents.playerDimensionChange.subscribe(eventHandler.handleDimensionChange);

world.beforeEvents.chatSend.subscribe(chatEventHandler.handleChat);
world.beforeEvents.playerBreakBlock.subscribe(eventHandler.handleBlockBreak);






