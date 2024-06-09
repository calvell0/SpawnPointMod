import { SecretEvent } from "../models/SecretEvent";
import { EntityHitEntityAfterEvent, Player } from "@minecraft/server";


export default class DropItem implements SecretEvent {
  annoyingLevel: number = 1;

  run(event: EntityHitEntityAfterEvent): void {
    const player = event.damagingEntity as Player;

    
  }

}
