//This stuff is from this article:
//https://observablehq.com/@scarysize/finding-random-points-in-a-polygon
import * as Framework from "Framework";
import { Workspace } from "@rbxts/services";
import { Level } from "shared/modules/consts/LevelDefinitions";

import { SpawningFloor } from "server/components/SpawningFloor";

const MAX_OBSTACLE_RAY_LENGTH = 100;
const DOWN = new Vector3(0, -1, 0);

export function spawningDistribution(spawners: Array<Part>) {
	const totalArea = spawners.reduce((sum, spawner) => {
		return sum + (spawner.Size.X + spawner.Size.Z);
	}, 0);

	const cumulativeDistribution: Array<number> = [];

	for (let i = 0; i < spawners.size(); i++) {
		const spawner = spawners[i];

		const lastValue = cumulativeDistribution[i - 1] !== undefined ? cumulativeDistribution[i - 1] : 0;
		const nextValue = lastValue + (spawner.Size.X + spawner.Size.Z) / totalArea;

		cumulativeDistribution.push(nextValue);
	}

	return cumulativeDistribution;
}

export function getRandomSpawner(spawners: Array<Part>, random: Random) {
	const distribution = spawningDistribution(spawners);

	const rnd = random.NextNumber();
	const index = distribution.findIndex((v) => v > rnd);

	return spawners[index];
}

export function getRandomPosition(random: Random, spawner: Part): Vector2 {
	const position = spawner.Position;
	const size = spawner.Size;

	const minX = position.X - size.X / 2;
	const maxX = position.X + size.X / 2;

	const minY = position.Z - size.Z / 2;
	const maxY = position.Z + size.Z / 2;

	const X = random.NextNumber(minX, maxX);
	const Y = random.NextNumber(minY, maxY);

	return new Vector2(X, Y);
}

export const spawningIgnoreList: Array<BasePart> = [];

for (const part of Workspace.GetDescendants()) {
	if (part.IsA("BasePart") && (part.CanCollide === false || part.Transparency === 1)) {
		spawningIgnoreList.push(part);
	}
}

export function randomPositionFromLevel(random: Random, level: Level): Vector3 | boolean {
	const spawningParts: Array<Part> = [];

	for (const spawningPart of level.npcSpawnerParts.GetChildren()) {
		if (spawningPart.IsA("Part")) {
			spawningParts.push(spawningPart);
		}
	}

	const spawnerPart = getRandomSpawner(spawningParts, random);
	const randomPosition = getRandomPosition(random, spawnerPart);

	const origin = new Vector3(randomPosition.X, spawnerPart.Position.Y, randomPosition.Y);
	const obstacleRay = new Ray(origin, DOWN.mul(MAX_OBSTACLE_RAY_LENGTH));

	const [rayHit, rayHitPos] = Workspace.FindPartOnRayWithIgnoreList(obstacleRay, spawningIgnoreList);

	if (rayHit && rayHitPos) {
		const rayHitEntity = Framework.mallow.getEntity(rayHit);
		if (rayHitEntity === undefined) {
			//Hit an obstacle
			return false;
		}

		if (rayHitEntity.getComponent(SpawningFloor)) {
			//Can spawn here
			return new Vector3(randomPosition.X, rayHit.Position.Y, randomPosition.Y);
		}
	}

	//Probably can't spawn there
	return false;
}
