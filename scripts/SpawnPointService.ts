import {
  DimensionLocation, Entity,
  EntityDieAfterEvent, EntityQueryOptions,
  Player,
  PlayerSpawnAfterEvent, system,
  Vector3,
  world,
} from "@minecraft/server";
import Utilities from "./resources/Utilities";
import PlayerInterface from "./PlayerInterface";
import { MessageFormResponse } from "@minecraft/server-ui";
import { handleGenericPlayerEvent } from "./fuckWithPlayers";

export default class SpawnPointService{

  static spawnPointService: SpawnPointService;

  private playerSpawns: Map<string, Spawns>;
  //key: player id to be monitored value: original player spawn point
  private playerSpawnsToMonitor: Set<string>;
  private listeningToSpawns:boolean = false;

  private constructor() {
    this.playerSpawns = new Map();
    this.playerSpawnsToMonitor = new Set();
    world.afterEvents.entityDie.subscribe(this.handleEntityDie);
    this.handleEntityDie = this.handleEntityDie.bind(this);
    this.registerPlayerSpawn = this.registerPlayerSpawn.bind(this);
    this.handlePlayerResponse = this.handlePlayerResponse.bind(this);
    this.listenToSpawns = this.listenToSpawns.bind(this);
    this.handlePlayerSpawn = this.handlePlayerSpawn.bind(this);
  }

  static getSpawnService():SpawnPointService {
    return SpawnPointService.spawnPointService || new SpawnPointService();
  }

  registerPlayerSpawn(player: Player):void{
    const playerLocation: DimensionLocation = Utilities.vector3ToDimensionLocation(player.getHeadLocation());
    const playerSpawn: DimensionLocation = Utilities.getOriginalSpawn(player);
    this.playerSpawns.set(player.id, { originalSpawn: playerSpawn, secondarySpawn: playerLocation });
  }

  handleEntityDie(event: EntityDieAfterEvent):void {
    if (!Utilities.entityIsPlayer(event.deadEntity) ||
      !this.playerSpawns.has(event.deadEntity.id))
    {
      return;
    }

    const player: Player = event.deadEntity as Player;
    // @ts-ignore function exits early if player id is not in playerSpawns
    const {originalSpawn, secondarySpawn } = this.playerSpawns.get(player.id);


    PlayerInterface.promptDeadPlayer(player, originalSpawn, secondarySpawn)
      .then((response: MessageFormResponse)=> {
      this.handlePlayerResponse(response, player);
    });
  }

  handlePlayerResponse(response: MessageFormResponse, player: Player){
    if (response.selection === 1 || !response){
      return;
    }
    //@ts-ignore
    const { originalSpawn, secondarySpawn } = this.playerSpawns.get(player.id);
    player.setSpawnPoint(secondarySpawn);
    this.listenToSpawns(player);
  }

  listenToSpawns(player: Player){
    if (!this.listeningToSpawns){
      world.afterEvents.playerSpawn.subscribe(this.handlePlayerSpawn);
      this.listeningToSpawns = true;
    }
    this.playerSpawnsToMonitor.add(player.id);
  }

  handlePlayerSpawn(event: PlayerSpawnAfterEvent):void {
    if (!this.playerSpawnsToMonitor.has(event.player.id)){
      return;
    }
    const player = event.player;
    //@ts-ignore
    const { originalSpawn } = this.playerSpawns.get(player.id);
    system.runTimeout(() => {
      player.setSpawnPoint(originalSpawn);
    })
    this.playerSpawnsToMonitor.delete(player.id);
    if (this.playerSpawnsToMonitor.size === 0){
      world.afterEvents.playerSpawn.unsubscribe(this.handlePlayerSpawn);
      this.listeningToSpawns = false;
    }
  }
}