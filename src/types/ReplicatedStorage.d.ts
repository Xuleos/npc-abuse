// eslint-disable-next-line roblox-ts/module
interface ReplicatedStorage extends Instance {
	assets: Folder & {
		Dummy: Model;
		animations: Folder & {
			HoldingUp: Animation;
		};
	};
}
