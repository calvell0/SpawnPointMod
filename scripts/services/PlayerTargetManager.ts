import targetPlayers from "../resources/player_targets/playerIndex";
import { Player, world } from "@minecraft/server";
import { getPlayerFromList } from "../resources/Utilities";

export default class PlayerTargetManager {

  private static _instance: PlayerTargetManager;

  //all targeted players
  private readonly playerTargetRegistry: PlayerTarget[];
  //target players that are currently in the world
  private activePlayerTargets: Set<string>;

  private constructor() {

    this.playerTargetRegistry = targetPlayers;
    this.activePlayerTargets = new Set();
    this.refreshActivePlayers = this.refreshActivePlayers.bind(this);
    this.identifyPlayerTargetOnSpawn = this.identifyPlayerTargetOnSpawn.bind(this);
    PlayerTargetManager._instance = this;
  }

  static getInstance(): PlayerTargetManager {
    return this._instance || new PlayerTargetManager();
  }

  isTarget(player: Player): boolean {
    return this.activePlayerTargets.has(player.id);
  }

  refreshActivePlayers(): void {
    this.activePlayerTargets.clear();
    world.getPlayers().filter((player): boolean => {
      return !!(getPlayerFromList(player.name, this.playerTargetRegistry));
    }).map((player) => {
      this.activePlayerTargets.add(player.id);
    });
  }

  identifyPlayerTargetOnSpawn({ player }: { player: Player }): void {

    if (!getPlayerFromList(player.name, this.playerTargetRegistry)) {
      return;
    }
    this.activePlayerTargets.add(player.id);
  }

  togglePlayerTarget(player: Player): boolean {
    if (this.deactivatePlayerTarget(player)) return false;
    this.activePlayerTargets.add(player.id);
    return true;
  }

  deactivatePlayerTarget(player: Player | string): boolean {
    let id;

    if (typeof player !== "string") {
      id = player.id;
    } else id = player;
    return this.activePlayerTargets.delete(id);
  }

}