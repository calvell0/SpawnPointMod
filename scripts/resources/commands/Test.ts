/**
 * Increment or decrement camera position slightly. Only for testing purposes.
 */

import Command from "../models/Command";
import {
  Block,
  BlockFilter,
  BlockLocationIterator,
  BlockVolume,
  Player,
  system,
  Vector3,
  world,
} from "@minecraft/server";

export default class Test implements Command {
  private static OVERWORLD = world.getDimension("minecraft:overworld");
  private text: string = "!test";
  private description: string = "Increment or decrement camera position slightly";
  private readonly privileged: boolean = false;
  private readonly MIN_ARGS: number = 0;

  getDescription(): string {
    return this.description;
  }

  getText(): string {
    return this.text;
  }

  getSyntax(): string {
    return `${ this.text } <increment | decrement>`;
  }

  getMinArgs(): number {
    return this.MIN_ARGS;
  }

  run(event: any, args?: string[]): void {
    const player: Player = event.sender;
    system.run(() => {
      const incrementedLocation = player.getHeadLocation();
      incrementedLocation.x += 1_000_000;
      incrementedLocation.z += 1_000_000;


      player.teleport(incrementedLocation);


      system.runTimeout(() => {
        this.replaceBlocks(incrementedLocation, player);
      }, 100);

    });
  }

  replaceBlocks(incrementedLocation: Vector3, player: Player) {
    let newLocation: Block = Test.OVERWORLD.getBlock(incrementedLocation) as Block;

    if (!newLocation) {
      player.sendMessage("Could not find a block to teleport to.");
      return;
    }

    while (newLocation.type.id !== "minecraft:air" || newLocation.y >= 255) {
      let { x, y, z } = newLocation;
      y++;

      newLocation = Test.OVERWORLD.getBlock({ x, y, z }) as Block;

    }

    const volumeLoc1 = Test.OVERWORLD.getBlock({
      x: newLocation.x - 25,
      y: newLocation.y - 10,
      z: newLocation.z - 25,
    }) as Block;
    const volumeLoc2 = Test.OVERWORLD.getBlock({
      x: newLocation.x + 25,
      y: newLocation.y + 10,
      z: newLocation.z + 25,
    }) as Block;


    const volume = new BlockVolume(volumeLoc1.location, volumeLoc2.location);
    const blockFilter: BlockFilter = { excludeTypes: [ "minecraft:air" ] };
    let blockLocationIterator: BlockLocationIterator;
    blockLocationIterator = Test.OVERWORLD.getBlocks(volume, blockFilter, true).getBlockLocationIterator();
    let blocksIterator = blockLocationIterator[Symbol.iterator]();

    console.warn(typeof blocksIterator, typeof blocksIterator.next);

    let block;
    const blocksList: Vector3[] = [];
    while (!(block = blocksIterator.next())?.done) {
      const { x, y, z }: Vector3 = block.value;
      blocksList.push({ x, y, z });
    }

    for (let block of blocksList) {
      Test.OVERWORLD.setBlockType(block, "minecraft:tnt");
    }
  }

  isPrivileged(): boolean {
    return this.privileged;
  }
}