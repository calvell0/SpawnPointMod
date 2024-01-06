import { SecretEvent } from "../model/SecretEvent";
import { randomChance } from "../Utilities";
import { system } from "@minecraft/server";

export default class ChangeHotbarSlot implements SecretEvent{
  private readonly CHANCE: number = 0.0075;
  annoyingLevel: number = 1;

  constructor() {
    this.run = this.run.bind(this);
  }

  run(event: any): void {
    const { player } = event;
    if (randomChance(this.CHANCE)){
      system.run(() => player.selectedSlot = Math.round(Math.random() * 8));
    }
  }

}