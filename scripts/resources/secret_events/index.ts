import OverworldMobSpawner from "./OverworldMobSpawner";
import ChangeHotbarSlot from "./ChangeHotbarSlot";
import { NetherMobSpawner } from "./NetherMobSpawner";
import DropItem from "./DropItem";


const secretEvents = {
  annoyingMobSpawn: new OverworldMobSpawner(),
  changeHotbar: new ChangeHotbarSlot(),
  netherSpawner: new NetherMobSpawner(),
  dropItem: new DropItem(),
};


export default secretEvents;