// eslint-disable-next-line roblox-ts/module
interface Workspace extends Model {
	Camera: Camera;
	baseplate: Part;
	Terrain: Terrain;
	npcSpawners: Folder & {
		level1: Folder;
	};
}
