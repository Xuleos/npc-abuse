import Signal from "@rbxts/signal";
import { PickupSystem } from "client/systems/PickupSystem";

declare global {
	interface SharedSystems {
		c: "dfh";
	}

	interface GlobalServerSystems extends SharedSystems {}

	interface GlobalClientSystems extends SharedSystems {
		PickupSystem: PickupSystem;
	}
}
