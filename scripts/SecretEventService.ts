import targetPlayers from "./resources/player_targets/playerIndex";
import {
  Entity,
  Player,
  PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockAfterEvent,
  PlayerLeaveBeforeEvent,
  PlayerSpawnAfterEvent, system, Vector3,
  world,
} from "@minecraft/server";
import { getPlayerFromList, getRandomNewLocation, randomChance } from "./resources/Utilities";
import secretEvents from './resources/secret_events/secretEventIndex'
import { SecretEvent } from "./resources/model/SecretEvent";

export default class SecretEventService {
  private static shenaniganService: SecretEventService;
  //all targeted players
  private readonly playerTargetList: PlayerTarget[];
  //target players that are currently in the world
  private activePlayerTargets: Set<Player>;




  private static blockInteractList: string[] = ["door", "gate", "table", "lever", "button"];

  private constructor() {
    SecretEventService.shenaniganService = this;
    this.playerTargetList = targetPlayers;
    this.activePlayerTargets = new Set();
    this.refreshActivePlayers = this.refreshActivePlayers.bind(this);
    this.handleBlockInteract = this.handleBlockInteract.bind(this);
    this.handleBlockBreak = this.handleBlockBreak.bind(this);
    this.handlePlayerLeave = this.handlePlayerLeave.bind(this);

    this.isTarget = this.isTarget.bind(this);
    this.identifyPlayerTargetOnSpawn = this.identifyPlayerTargetOnSpawn.bind(this);
    world.afterEvents.worldInitialize.subscribe(this.refreshActivePlayers);
  }

  static getShenaniganService(): SecretEventService {
    return SecretEventService.shenaniganService || new SecretEventService();
  }

  isTarget(player: Player): boolean {
    return this.activePlayerTargets.has(player);
  }


  refreshActivePlayers(): void {
    this.activePlayerTargets.clear();
    world.getPlayers().filter((player): boolean => {
      return !!(getPlayerFromList(player, this.playerTargetList));
    }).map((player) => {
      this.activePlayerTargets.add(player);
    });
  }

  identifyPlayerTargetOnSpawn({ player }: { player: Player }): void {
    let playerTarget;
    if (!(playerTarget = getPlayerFromList(player, this.playerTargetList))) {
      return;
    }
    this.activePlayerTargets.add(player);

  }

  handleBlockInteract(event: PlayerInteractWithBlockAfterEvent){
    if(!this.isTarget(event.player)) return;
    secretEvents.annoyingMobSpawn.run(event);
  }


  handleBlockBreak(event: PlayerBreakBlockBeforeEvent) {
    if (!this.isTarget(event.player)) {
      return;
    }


  }

  handlePlayerLeave(event: PlayerLeaveBeforeEvent){
    this.activePlayerTargets.delete(event.player);
  }


  }
