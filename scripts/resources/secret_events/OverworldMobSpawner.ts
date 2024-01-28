import { SecretEvent } from "../model/SecretEvent";
import { Block, Entity, Player, PlayerInteractWithBlockAfterEvent, system, Vector3 } from "@minecraft/server";
import { getRandomNewLocation, pickRandomUnweighted, randomChance } from "../Utilities";

export default class OverworldMobSpawner implements SecretEvent{

  annoyingLevel: number = 5;
  private static blockInteractList: string[] = ["door", "gate", "table", "lever", "button"];
  private static readonly MAX_TICK_DELAY: number = 10_000;
  private static readonly entityChoices: string[] = ["bat", "parrot", "rabbit"];
  constructor() {
    this.run = this.run.bind(this);
    this.executeAction = this.executeAction.bind(this);
    this.blockIsInList = this.blockIsInList.bind(this);
  }

  run(event: PlayerInteractWithBlockAfterEvent): void {
    const { player, block } = event;
    if (!this.blockIsInList(block)) return;
    if (randomChance(0.33)) {
      const rngDelay = Math.random() * OverworldMobSpawner.MAX_TICK_DELAY;
      system.runTimeout(() => this.executeAction(player), rngDelay);
    }
  }

  executeAction(player: Player){

    const playerLocation: Vector3 = player.location;
    const spawnLocation: Vector3 = getRandomNewLocation(playerLocation);
    const entityTypeToSpawn: string = "minecraft:" + pickRandomUnweighted<string>(OverworldMobSpawner.entityChoices);

    const newEntity: Entity = player.dimension.spawnEntity(entityTypeToSpawn, spawnLocation);
  }

  blockIsInList(block: Block):boolean {
    for (let blocktype of OverworldMobSpawner.blockInteractList){
      if (block.type.id.includes(blocktype)){
        return true;
      }
    }
    return false;
  }

}