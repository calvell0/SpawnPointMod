import { SecretEvent } from "../models/SecretEvent";
import { randomChance } from "../Utilities";
import { system } from "@minecraft/server";

export default class ChangeHotbarSlot implements SecretEvent {
  annoyingLevel: number = 1;
  private readonly CHANCE: number = 0.01;

  constructor() {
    this.run = this.run.bind(this);
  }

  run(event: any): void {
    const { player } = event;
    if (randomChance(this.CHANCE)) {
      let newslot = Math.round(Math.random() * 8);
      system.run(() => player.selectedSlot = newslot);
    }
  }

}