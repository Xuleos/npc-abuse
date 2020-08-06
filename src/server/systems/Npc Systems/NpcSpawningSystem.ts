import * as Framework from "Framework";
import { RunService } from "@rbxts/services";
import { OutQuart } from "@rbxts/easing-functions";
import { LEVEL_DEFINITIONS, Level } from "shared/modules/consts/LevelDefinitions";
import { randomPositionFromLevel } from "server/modules/Npcs/spawningUtility";
import { createNpc } from "server/modules/Npcs/npcCharacter";
import { Debris } from "server/components/Debris";
import { Pickupable } from "shared/components/Pickupable";

const MIN_SPAWNING_INTERVAL = 0.1;
const MAX_SPAWNING_INTERVAL = 5;
const INTERVAL_CHANGE_RATE = 100;
const DESPAWN_TIME = 300;

export class NpcSpawningSystem extends Framework.ServerSystem {
	levelSpawners = new Map<
		string | number,
		{
			count: number;
			currentTime: number;
			interval: number;
			def: Level;
		}
	>();

	private random = new Random();

	start() {
		for (const [name, levelDef] of Object.entries(LEVEL_DEFINITIONS)) {
			this.levelSpawners.set(name, {
				count: 0,
				currentTime: this.random.NextNumber(MIN_SPAWNING_INTERVAL, MAX_SPAWNING_INTERVAL),
				interval: this.random.NextNumber(MIN_SPAWNING_INTERVAL, MAX_SPAWNING_INTERVAL),
				def: levelDef,
			});
		}

		RunService.Heartbeat.Connect((step) => {
			for (const [_, level] of this.levelSpawners) {
				level.currentTime += step;

				if (level.currentTime >= level.interval) {
					level.currentTime = 0;

					level.interval = this.getSpawnInterval(level.count);

					const position = randomPositionFromLevel(this.random, level.def);

					if (typeIs(position, "Vector3")) {
						const npc = createNpc(position);

						const npcEntity = Framework.mallow.fetchEntity(npc);
						npcEntity.addComponent(new Debris(npcEntity, DESPAWN_TIME));

						const pickupComp = npcEntity.addComponent(new Pickupable(npcEntity));
						pickupComp.weldInfo = {
							C0: new CFrame(0, 0, 5).mul(CFrame.Angles(math.pi / 2, 0, 0)),
						};

						level.count++;
					} else {
						//so there isn't a consequence if the level can't find a spawning spot
						level.currentTime = level.interval;
					}
				}
			}
		});
	}

	//Get a interval for a level based on how many npcs are already in it
	getSpawnInterval(count: number) {
		const change = MAX_SPAWNING_INTERVAL - MIN_SPAWNING_INTERVAL;
		const num = OutQuart(count, MIN_SPAWNING_INTERVAL, change, INTERVAL_CHANGE_RATE);

		return math.clamp(num, MIN_SPAWNING_INTERVAL, MAX_SPAWNING_INTERVAL);
	}

	queries = {};
}
