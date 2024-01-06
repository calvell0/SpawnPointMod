import { SecretEvent } from "../model/SecretEvent";
import AnnoyingMobSpawner from "./AnnoyingMobSpawner";
import ChangeHotbarSlot from "./ChangeHotbarSlot";


const secretEvents = {
  annoyingMobSpawn: new AnnoyingMobSpawner(),
  changeHotbar: new ChangeHotbarSlot()
};


export default secretEvents;