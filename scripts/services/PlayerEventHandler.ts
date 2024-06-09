import PlayerTargetManager from "./PlayerTargetManager";
import EventDispatcher from "./EventDispatcher";
import {
  EntityHitEntityAfterEvent,
  Player,
  PlayerBreakBlockBeforeEvent,
  PlayerDimensionChangeAfterEvent,
  PlayerInteractWithBlockAfterEvent,
  PlayerLeaveBeforeEvent,
  PlayerSpawnAfterEvent,
} from "@minecraft/server";
import PlayerInterface from "./PlayerInterface";
import secretEvents from "../resources/secret_events/index";
import { isPlayer } from "../resources/Utilities";


export default class PlayerEventHandler {

  playerTargetManager: PlayerTargetManager;
  eventDispatcher: EventDispatcher;


  constructor(playerTargetManager: PlayerTargetManager, eventDispatcher: EventDispatcher) {
    this.playerTargetManager = playerTargetManager;
    this.eventDispatcher = eventDispatcher;
    this.handlePlayerLeave = this.handlePlayerLeave.bind(this);
    this.handlePlayerSpawn = this.handlePlayerSpawn.bind(this);
    this.handleBlockBreak = this.handleBlockBreak.bind(this);
    this.handleBlockInteract = this.handleBlockInteract.bind(this);
    this.handleDimensionChange = this.handleDimensionChange.bind(this);

  }

  handlePlayerLeave(event: PlayerLeaveBeforeEvent): void {
    this.playerTargetManager.deactivatePlayerTarget(event.player);
  }

  handlePlayerSpawn(event: PlayerSpawnAfterEvent): void {
    if (event.initialSpawn) {
      PlayerInterface.sendWelcomeMessage(event.player);
    }
    this.playerTargetManager.refreshActivePlayers();
  }

  handleBlockBreak(event: PlayerBreakBlockBeforeEvent) {
    if (!this.playerTargetManager.isTarget(event.player)) {
      return;
    }
    this.eventDispatcher.runEvent(secretEvents.changeHotbar, event);
  }

  handleBlockInteract(event: PlayerInteractWithBlockAfterEvent) {
    if (!this.playerTargetManager.isTarget(event.player)) {
      return;
    }
    this.eventDispatcher.runEvent(secretEvents.annoyingMobSpawn, event);
  }

  handleDimensionChange(event: PlayerDimensionChangeAfterEvent) {

  }

  handleEntityAttack(event: EntityHitEntityAfterEvent) {
    if (!isPlayer(event.damagingEntity)) {
      return;
    }
    const player = event.damagingEntity as Player;
    if (!this.playerTargetManager.isTarget(player)) {
      return;
    }
    this.eventDispatcher.runEvent(secretEvents.dropItem, event);
  }


}