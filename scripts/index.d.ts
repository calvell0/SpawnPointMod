import { DimensionLocation } from "@minecraft/server";

declare global {
  interface String{
    equalsIgnoreCase(this: string, compareTo: string): boolean;
  }
  interface Spawns{
    originalSpawn: DimensionLocation;
    secondarySpawn: DimensionLocation;
  }
}


export {};