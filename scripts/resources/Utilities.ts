import { DimensionLocation, Entity, EntityQueryOptions, Player, Vector3, world } from "@minecraft/server";

export default class Utilities{
  static vector3ToDimensionLocation = (vec: Vector3, dimensionId: string = "overworld"): DimensionLocation => {
    let x = Math.round(vec.x);
    let y = Math.round(vec.y);
    let z = Math.round(vec.z);
    let dimension = world.getDimension(dimensionId);
    return { x, y, z, dimension };
  };

  static getOriginalSpawn(player: Player):DimensionLocation{
    return player.getSpawnPoint() ||
    Utilities.vector3ToDimensionLocation(world.getDefaultSpawnLocation());
  }

  static entityIsPlayer(entity: Entity): boolean{
    const entityQuery: EntityQueryOptions = {
      type: "player"
    };
    return entity.matches(entityQuery);
  }

}