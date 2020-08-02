import { Workspace } from "@rbxts/services";

interface Level {
	npcSpawnerParts: Folder;
}

export const LEVEL_DEFINITIONS: {
	[name: string]: Level;
} = {
	Level1: {
		npcSpawnerParts: Workspace.npcSpawners.level1,
	},
};
