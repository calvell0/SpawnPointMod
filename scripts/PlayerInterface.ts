import { DimensionLocation, Player, PlayerSpawnAfterEvent, system } from "@minecraft/server";
import { MessageFormData, MessageFormResponse } from "@minecraft/server-ui";


export default class PlayerInterface{
  static promptDeadPlayer(player: Player, originalSpawn: DimensionLocation, secondarySpawn: DimensionLocation):Promise<MessageFormResponse> {
    const { x: x1, z: z1 } = originalSpawn;
    const { x: x2, y: y2, z: z2 } = secondarySpawn;

    const messageForm = new MessageFormData()
      .title("Select a spawn point:")
      .body(`Original spawn: ${x1}, ${64}, ${z1} \n Secondary spawn point: ${x2}, ${y2}, ${z2}`)
      .button1(`Original spawn`)
      .button2(`Secondary spawn`);

    return messageForm.show(player);
  }
  static setTitle(player: Player, title: string, subtitle: string = "") {
    player.onScreenDisplay.setTitle(title, {
      stayDuration: 80,
      fadeInDuration: 4,
      fadeOutDuration: 3,
      subtitle: subtitle
    });
  }

  static handlePlayerLoad = (event: PlayerSpawnAfterEvent) => {
    if (!event.initialSpawn){
      return;
    }
    // PlayerInterface.setTitle(event.player, "Welcome, Sack Chaser!");
    system.runTimeout(() => {
      event.player.sendMessage("Type §3!setspawn §fin chat to set a secondary spawn point. You'll be able to select which point to spawn at after dying. Type §3!help §ffor a list of commands.")
    }, 100);

  };

}