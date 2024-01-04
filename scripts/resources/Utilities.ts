import { DimensionLocation, Entity, EntityQueryOptions, Player, Vector3, world } from "@minecraft/server";



  /**
   * Convert a Vector3 object to a DimensionLocation
   * @param vec - The Vector3 to be converted
   * @param [dimensionId=overworld] - The dimensionId to attach to the Vector3
   * @returns a DimensionLocation with the same x, y, z values as **vec**
   */
   export function vector3ToDimensionLocation(vec: Vector3, dimensionId: string = "overworld"): DimensionLocation {
    let x = Math.round(vec.x);
    let y = Math.round(vec.y);
    let z = Math.round(vec.z);
    let dimension = world.getDimension(dimensionId);
    return { x, y, z, dimension };
  };

  /**
   * Gets the original spawn point of a player, or the default
   * if the player's spawn is *undefined*
   * @param {Player} player - The player whose spawn to query
   */
   export function getOriginalSpawn(player: Player): Vector3{
     const { x, y, z } =
     player.getSpawnPoint() || world.getDefaultSpawnLocation();
    return { x, y, z } as Vector3;
  }

  /**
   * Checks if a provided entity is a Player
   * @param {Entity} entity - the Entity to be checked
   * @returns true if entity is a Player, false if not
   */
   export function isPlayer(entity: Entity): boolean {

    return entity instanceof Player;
  }

/**
 * Generates a random new location based on the location passed to it
 * @param coordinates - the base coordinates
 * @param maxDistance - the maximum absolute value of the difference between base and new coordinates
 */
export function getRandomNewLocation (coordinates: Vector3, maxDistance: number = 15): Vector3{
  coordinates.x += Math.round(Math.random() * (maxDistance * 2)) - maxDistance;
  coordinates.z += Math.round(Math.random() * (maxDistance * 2)) - maxDistance;
  return coordinates;
}




