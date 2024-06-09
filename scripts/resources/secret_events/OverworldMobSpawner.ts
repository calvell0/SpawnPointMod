import { SecretEvent } from "../models/SecretEvent";
import { Block, Entity, Player, PlayerInteractWithBlockAfterEvent, system, Vector3 } from "@minecraft/server";
import { getRandomNewLocation, pickRandomUnweighted, randomChance } from "../Utilities";

export default class OverworldMobSpawner implements SecretEvent {

  private static blockInteractList: string[] = [ "door", "gate", "table", "lever", "button" ];
  private static readonly MAX_TICK_DELAY: number = 1_000;
  private static readonly entityChoices: string[] = [ "bat", "parrot", "rabbit" ];
  private static readonly CHANCE: number = 0.25;
  annoyingLevel: number = 5;

  constructor() {
    this.run = this.run.bind(this);
    this.executeAction = this.executeAction.bind(this);
    this.blockIsInList = this.blockIsInList.bind(this);
  }

  run(event: PlayerInteractWithBlockAfterEvent): void {
    const { player, block } = event;
    if (!this.blockIsInList(block)) return;
    if (randomChance(OverworldMobSpawner.CHANCE)) {
      const rngDelay = Math.random() * OverworldMobSpawner.MAX_TICK_DELAY;
      system.runTimeout(() => this.executeAction(player), rngDelay);
    }
  }

  executeAction(player: Player) {
    let newEntity: Entity | undefined = undefined;
    while (!newEntity) {
      try {
        const playerLocation: Vector3 = player.location;
        const spawnLocation: Vector3 = getRandomNewLocation(playerLocation);
        const entityTypeToSpawn: string = "minecraft:" + pickRandomUnweighted<string>(OverworldMobSpawner.entityChoices);

        newEntity = player.dimension.spawnEntity(entityTypeToSpawn, spawnLocation);
      } catch (exception) {
        console.error(exception);
      }
    }
  }

  blockIsInList(block: Block): boolean {
    for (let blocktype of OverworldMobSpawner.blockInteractList) {
      if (block.type.id.includes(blocktype)) {
        //console.warn(block.type.id, block.typeId);
        return true;
      }
    }
    return false;
  }

}