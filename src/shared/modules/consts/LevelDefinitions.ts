import { Workspace } from "@rbxts/services";

export interface Level {
	npcSpawnerParts: Folder;
}

export const LEVEL_DEFINITIONS: {
	[name: string]: Level;
} = {
	Level1: {
		npcSpawnerParts: Workspace.npcSpawners.level1,
	},
};
