import { Player, WorldAfterEvents } from "@minecraft/server";

export interface SecretEvent {
  annoyingLevel: number;

  run(event: any):void;
}