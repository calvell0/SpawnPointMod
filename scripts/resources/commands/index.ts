import GetSpawn from "./GetSpawn";
import SetSpawn from "./SetSpawn";
import Help from "./Help";
import Yell from "./Yell";
import ToggleHarassment from "./ToggleHarassment";
import Test from "./Test";
import PlayerTargetManager from "../../services/PlayerTargetManager";
import SpawnPointService from "../../services/SpawnPointService";

const playerTargetManager = PlayerTargetManager.getInstance();
const spawnPointService = SpawnPointService.getInstance();

let allCommands;
export default allCommands = [
  new GetSpawn(spawnPointService),
  new SetSpawn(spawnPointService),
  new Help(),
  new Yell(),
  new ToggleHarassment(playerTargetManager),
  new Test(),
];

