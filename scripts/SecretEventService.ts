import targetPlayers from "./resources/player_targets/playerIndex";
import {
  Dimension,
  Entity,
  Player,
  PlayerBreakBlockBeforeEvent, PlayerDimensionChangeAfterEvent, PlayerInteractWithBlockAfterEvent,
  PlayerLeaveBeforeEvent,
  PlayerSpawnAfterEvent, system, Vector3,
  world,
} from "@minecraft/server";
import { getPlayerFromList, getRandomNewLocation, pickRandomUnweighted, randomChance } from "./resources/Utilities";
import secretEvents from "./resources/secret_events/secretEventIndex";
import { SecretEvent } from "./resources/model/SecretEvent";
import ChangeHotbarSlot from "./resources/secret_events/ChangeHotbarSlot";
import secretEventIndex from "./resources/secret_events/secretEventIndex";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";

export default class SecretEventService {
  private static secretEventService: SecretEventService;
  //all targeted players
  private readonly playerTargetList: PlayerTarget[];
  //target players that are currently in the world
  private activePlayerTargets: Set<Player>;


  private static blockInteractList: string[] = ["door", "gate", "table", "lever", "button"];


  private constructor() {
    SecretEventService.secretEventService = this;
    this.playerTargetList = targetPlayers;
    this.activePlayerTargets = new Set();
    this.refreshActivePlayers = this.refreshActivePlayers.bind(this);
    this.handleBlockInteract = this.handleBlockInteract.bind(this);
    this.handleBlockBreak = this.handleBlockBreak.bind(this);
    this.handlePlayerLeave = this.handlePlayerLeave.bind(this);
    this.handlePlayerDimensionChange = this.handlePlayerDimensionChange.bind(this);

    this.isTarget = this.isTarget.bind(this);
    this.identifyPlayerTargetOnSpawn = this.identifyPlayerTargetOnSpawn.bind(this);
    world.afterEvents.worldInitialize.subscribe(this.refreshActivePlayers);
    world.afterEvents.playerDimensionChange.subscribe(this.handlePlayerDimensionChange);
  }

  static getSecretEventService(): SecretEventService {
    return SecretEventService.secretEventService || new SecretEventService();
  }

  isTarget(player: Player): boolean {
    return this.activePlayerTargets.has(player);
  }


  refreshActivePlayers(): void {
    this.activePlayerTargets.clear();
    world.getPlayers().filter((player): boolean => {
      return !!(getPlayerFromList(player.name, this.playerTargetList));
    }).map((player) => {
      this.activePlayerTargets.add(player);
    });
  }

  identifyPlayerTargetOnSpawn({ player }: { player: Player }): void {
    let playerTarget;
    if (!(playerTarget = getPlayerFromList(player.name, this.playerTargetList))) {
      return;
    }
    this.activePlayerTargets.add(player);

  }

  handleBlockInteract(event: PlayerInteractWithBlockAfterEvent): void {
    if (!this.isTarget(event.player)) return;
    secretEvents.annoyingMobSpawn.run(event);
  }


  handleBlockBreak(event: PlayerBreakBlockBeforeEvent): void {
    if (!this.isTarget(event.player)) {
      return;
    }
    secretEvents.changeHotbar.run(event);

  }

  handlePlayerDimensionChange(event: PlayerDimensionChangeAfterEvent): void {
    const { player, toDimension, fromDimension }: {
      player: Player,
      toDimension: Dimension,
      fromDimension: Dimension
    } = event;
    if (fromDimension.id === MinecraftDimensionTypes.Nether) {
      secretEvents.netherSpawner.clearNetherspawnHandle(event);
    }
    if (toDimension.id !== "nether" || !this.isTarget(player)) {
      return;
    }
    secretEvents.netherSpawner.run(event);


  }


  handlePlayerLeave(event: PlayerLeaveBeforeEvent): void {
    this.activePlayerTargets.delete(event.player);
  }

  togglePlayerTarget(player: Player):boolean {
    return this.activePlayerTargets.delete(player) || !this.activePlayerTargets.add(player);
  }


}
