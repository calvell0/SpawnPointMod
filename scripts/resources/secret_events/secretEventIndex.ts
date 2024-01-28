
import OverworldMobSpawner from "./OverworldMobSpawner";
import ChangeHotbarSlot from "./ChangeHotbarSlot";
import { NetherMobSpawner } from "./NetherMobSpawner";


const secretEvents = {
  annoyingMobSpawn: new OverworldMobSpawner(),
  changeHotbar: new ChangeHotbarSlot(),
  netherSpawner: new NetherMobSpawner()
};


export default secretEvents;