import * as Framework from "Framework";
import { RunService } from "@rbxts/services";
import { OutQuart } from "@rbxts/easing-functions";
import { LEVEL_DEFINITIONS } from "shared/modules/consts/LevelDefinitions";

const MIN_SPAWNING_INTERVAL = 0.1;
const MAX_SPAWNING_INTERVAL = 5;
const INTERVAL_CHANGE_RATE = 75;

export class NpcSpawningSystem extends Framework.ServerSystem {
	levelSpawners = new Map<
		string | number,
		{
			count: number;
			currentTime: number;
			interval: number;
		}
	>();

	start() {
		for (const name of Object.keys(LEVEL_DEFINITIONS)) {
			this.levelSpawners.set(name, {
				count: 0,
				currentTime: 0,
				interval: MIN_SPAWNING_INTERVAL,
			});
		}

		RunService.Heartbeat.Connect((step) => {
			for (const [_, level] of this.levelSpawners) {
				level.currentTime += step;

				if (level.currentTime >= level.interval) {
					level.currentTime = 0;

					level.interval = this.getSpawnInterval(level.count);

					level.count++;
				}
			}
		});
	}

	//Get a interval for a level based on how many npcs are already in it
	getSpawnInterval(count: number) {
		const change = MIN_SPAWNING_INTERVAL - MAX_SPAWNING_INTERVAL;
		const num = OutQuart(count, MAX_SPAWNING_INTERVAL, change, INTERVAL_CHANGE_RATE);

		return math.clamp(num, MIN_SPAWNING_INTERVAL, MAX_SPAWNING_INTERVAL);
	}

	queries = {};
}
