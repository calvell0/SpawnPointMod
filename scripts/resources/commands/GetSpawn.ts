import Command from "../model/Command";
import { Player } from "@minecraft/server";

export default class GetSpawn implements Command{
  private text: string = "!getspawn";
  private description: string = "View your current spawn point(s)";


  handle(command: string[], player: Player): void {

  }

  getText(): string {
    return this.text;
  }

  getDescription(): string {
    return this.description;
  }

}