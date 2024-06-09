import { EntityDieAfterEvent, Player, PlayerSpawnAfterEvent, Vector3, world } from "@minecraft/server";
import { getOriginalSpawn, isPlayer } from "../resources/Utilities";
import PlayerInterface from "./PlayerInterface";
import { MessageFormResponse } from "@minecraft/server-ui";

export default class SpawnPointService {

  private static _instance: SpawnPointService;

  //key: player id to be monitored value: original player spawn point
  private playerSpawnsToMonitor: Set<string>;
  private listeningToSpawns: boolean = false;

  private constructor() {
    this.listenToSpawns = this.listenToSpawns.bind(this);
    this.handleEntityDie = this.handleEntityDie.bind(this);
    this.handlePlayerSpawn = this.handlePlayerSpawn.bind(this);
    this.handlePlayerResponse = this.handlePlayerResponse.bind(this);
    this.registerPlayerSpawn = this.registerPlayerSpawn.bind(this);
    this.playerSpawnsToMonitor = new Set();
    world.afterEvents.entityDie.subscribe(this.handleEntityDie);
    SpawnPointService._instance = this;
  }

  static getInstance(): SpawnPointService {
    return SpawnPointService._instance || new SpawnPointService();
  }


  registerPlayerSpawn(player: Player): void {
    const playerLocation: Vector3 = player.getHeadLocation();
    let { x, y, z }: Vector3 = playerLocation;
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);

    player.setDynamicProperty(`spawn:secondary`, { x, y, z } as Vector3);
  }

  handleEntityDie(event: EntityDieAfterEvent): void {
    const deadEntity = event.deadEntity;
    if (!isPlayer(deadEntity) || !(deadEntity.getDynamicProperty(`spawn:secondary`))) {
      return;
    }
    const player: Player = deadEntity as Player;
    const secondarySpawn: Vector3 =
      player.getDynamicProperty(`spawn:secondary`) as Vector3;
    const originalSpawn: Vector3 = getOriginalSpawn(player);

    // @ts-ignore function exits early if player id is not in playerSpawns


    PlayerInterface.promptDeadPlayer(player, originalSpawn, secondarySpawn).then((response: MessageFormResponse) => {
      this.handlePlayerResponse(response, player);
    });
  }

  handlePlayerResponse(response: MessageFormResponse, player: Player) {
    if (response.canceled || response.selection === 0) {
      return;
    }
    this.listenToSpawns(player);
  }

  listenToSpawns(player: Player) {
    if (!this.listeningToSpawns) {
      world.afterEvents.playerSpawn.subscribe(this.handlePlayerSpawn);
      this.listeningToSpawns = true;
    }
    this.playerSpawnsToMonitor.add(player.id);
  }

  handlePlayerSpawn(event: PlayerSpawnAfterEvent): void {
    if (!this.playerSpawnsToMonitor.has(event.player.id)) {
      return;
    }
    const player: Player = event.player;

    const { x, y, z }: Vector3 =
      player.getDynamicProperty(`spawn:secondary`) as Vector3;


    player.teleport({ x, y, z },
      {
        dimension: world.getDimension("overworld"),
      });

    this.playerSpawnsToMonitor.delete(player.id);
    if (this.playerSpawnsToMonitor.size === 0) {
      world.afterEvents.playerSpawn.unsubscribe(this.handlePlayerSpawn);
      this.listeningToSpawns = false;
    }
  }

  getPlayerSpawn(player: Player): Vector3 | undefined {
    return player.getDynamicProperty("spawn:secondary") as Vector3 | undefined;
  }
}
