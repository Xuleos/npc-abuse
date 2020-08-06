import * as Framework from "Framework";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import App from "client/modules/roact-components/App";

export class UISystem extends Framework.ClientSystem {
	start() {
		const player = Players.LocalPlayer;
		const playerGui = player.FindFirstChildOfClass("PlayerGui");

		Roact.mount(<App />, playerGui);
	}

	queries = {};
}
