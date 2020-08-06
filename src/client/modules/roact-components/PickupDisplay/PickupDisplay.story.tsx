import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";

import ThemeProvider from "../ThemeProvider";
import PickupDisplay from ".";

export = (target: GuiObject) => {
	const part = new Instance("Part");
	part.Size = new Vector3(2, 2, 1);
	part.Parent = Workspace;

	const element = (
		<ThemeProvider>
			<PickupDisplay Adornee={part} />
		</ThemeProvider>
	);

	const mount = Roact.mount(element, part, "PickupDisplay");

	return () => {
		Roact.unmount(mount);

		part.Destroy();
	};
};
