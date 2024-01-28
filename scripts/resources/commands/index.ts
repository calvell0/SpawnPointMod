import GetSpawn from "./GetSpawn";
import SetSpawn from "./SetSpawn";
import Command from "../model/Command";
import Help from "./Help";
import Yell from "./Yell";
import SpawnPointService from "../../SpawnPointService";
import SecretEventService from "../../SecretEventService";
import { ToggleHarassment } from "./ToggleHarassment";

const spawnService = SpawnPointService.getSpawnService();
const secretService = SecretEventService.getSecretEventService();

const allCommands: Command[] = [
  new GetSpawn(spawnService),
  new SetSpawn(spawnService),
  new Help(),
  new Yell(),
  new ToggleHarassment(secretService),
];


export default allCommands;