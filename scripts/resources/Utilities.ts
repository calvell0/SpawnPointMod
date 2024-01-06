import { Dimension, DimensionLocation, Entity, EntityQueryOptions, Player, Vector3, world } from "@minecraft/server";


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
  let dimension: Dimension = world.getDimension(dimensionId);
  return { x, y, z, dimension };
}

/**
 * Gets the original spawn point of a player, or the default
 * if the player's spawn is *undefined*
 * @param {Player} player - The player whose spawn to query
 */
export function getOriginalSpawn(player: Player): Vector3 {
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
 * @param maxDistance - the maximum absolute value of the difference between base and new coordinates. Default value of 25
 */
export function getRandomNewLocation(coordinates: Vector3 | DimensionLocation, maxDistance: number = 25): Vector3 | DimensionLocation {
  coordinates.x += Math.round(Math.random() * (maxDistance * 2)) - maxDistance;
  coordinates.z += Math.round(Math.random() * (maxDistance * 2)) - maxDistance;
  return coordinates;
}

export function getPlayerFromList(player: Player, list: PlayerTarget[]):PlayerTarget | undefined {
  for(let pTarget of list){
    if (player.name.equalsIgnoreCase(pTarget.username)){
      return pTarget;
    }
  }
  return undefined;
}

export function randomChance(chance: number):boolean{
  const rng = Math.random();
  return rng < chance;
}

/**
 * Given an array of options, picks randomly from those options. Likelihood of each outcome
 * is approximately equal
 * @param choices - Array of options you'd like to select from
 * @returns a randomly selected member of the **choices** that were passed
 */
export function pickRandomUnweighted<Type>(choices: Type[]):Type {
  const rng = Math.random();
  const selectedIndex = Math.round(rng * (choices.length - 1));
  return choices[selectedIndex];
}

export function coordsToString(coords: Vector3 | DimensionLocation):string {
  return coords.x + ", " + coords.y + ", " + coords.z;
}

function pickRandomWeighted<Type>(choices: WeightedChoice<Type>[]):Type {
  choices = choices.sort(
    (a, b) => {
     return a.weight - b.weight;
    });
  return choices[0].value;
}




