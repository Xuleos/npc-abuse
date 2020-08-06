import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";

import Inputs from "client/modules/Inputs";
import ThemeProvider from "../ThemeProvider";
import Action from ".";

export = () => {
	const part = new Instance("Part");
	part.Size = new Vector3(2, 2, 1);
	part.Parent = Workspace;

	const element = (
		<ThemeProvider>
			<Action name={"Action"} input={Inputs.light.E} />
		</ThemeProvider>
	);

	const mount = Roact.mount(element, part, "PickupDisplay");

	return () => {
		Roact.unmount(mount);

		part.Destroy();
	};
};
