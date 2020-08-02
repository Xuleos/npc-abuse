import Signal from "@rbxts/signal"

declare global {
	interface SharedSystems {
		c: "dfh";
	}

	interface GlobalServerSystems extends SharedSystems {

	}

	interface GlobalClientSystems extends SharedSystems {

	}
}
