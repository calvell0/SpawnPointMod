import CommandReader from "./CommandReader";
import SpawnPointService from "./SpawnPointService";
import EventDispatcher from "./EventDispatcher";
import PlayerEventHandler from "./PlayerEventHandler";
import ChatEventHandler from "./ChatEventHandler";
import allCommands from "../resources/commands/index";
import PlayerTargetManager from "./PlayerTargetManager";


export const playerTargetManager = PlayerTargetManager.getInstance();
export const spawnPointService = SpawnPointService.getInstance();
export const eventDispatcher = new EventDispatcher();
export const eventHandler = new PlayerEventHandler(playerTargetManager, eventDispatcher);

export const commandReader = new CommandReader(eventDispatcher, allCommands);
export const chatEventHandler = new ChatEventHandler(eventDispatcher, commandReader);


