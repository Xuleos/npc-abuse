import Signal from "@rbxts/signal";
import { PickupDisplaySystem } from "client/systems/PickupDisplaySystem";

declare global {
	interface SharedSystems {
		c: "dfh";
	}

	interface GlobalServerSystems extends SharedSystems {}

	interface GlobalClientSystems extends SharedSystems {
		PickupDisplaySystem: PickupDisplaySystem;
	}
}
