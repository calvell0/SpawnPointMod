import { DimensionLocation } from "@minecraft/server";

declare global {
  interface String {
    equalsIgnoreCase(this: string, compareTo: string): boolean;
  }

  interface Spawns {
    originalSpawn: DimensionLocation;
    secondarySpawn: DimensionLocation;
  }

  interface PlayerTarget {
    name: string;
    username: string;
    harassment_level: number;
  }

  enum Rarity {
    common = 0.5,
    uncommon = 0.2,
    rare = 0.1,
    very_rare = 0.025,
    quite_rare = 0.0075,
    extremely_rare = 0.001,
    never_happens = 0.0001
  }

  interface WeightedChoice<Type> {
    value: Type;
    weight: Rarity;
  }
}


export {};