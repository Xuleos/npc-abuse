import * as Framework from "Framework";
import { Debris } from "server/components/Debris";
import { RunService } from "@rbxts/services";

export class DebrisSystem extends Framework.ServerSystem {
	start() {
		RunService.Heartbeat.Connect((dt) => {
			for (const debrisObject of this.queries.debrisObjects.getResults()) {
				const debrisComp = debrisObject.getComponent(Debris);

				debrisComp.elapsedTime += dt;

				if (debrisComp.elapsedTime >= debrisComp.duration) {
					debrisObject.Instance.Destroy();
				}
			}
		});
	}

	queries = {
		debrisObjects: new Framework.Query([Debris]),
	};
}
