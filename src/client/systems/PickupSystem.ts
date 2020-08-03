import * as Framework from "Framework";
import { RunService, Players } from "@rbxts/services";

import { Pickupable } from "shared/components/Pickupable";

const MINIMUM_INTERVAl = 0.1;
const MAXIMUM_INTERVAL = 5;

export class PickupSystem extends Framework.ClientSystem {
	closestObject?: Model;

	localPlayer = Players.LocalPlayer;

	start() {
		//Use a similar technique to @rbxts/distancepoller to iterate over these and find the best one to be closestObject
		RunService.Heartbeat.Connect((dt) => {
			for (const entity of this.queries.pickupableObjects.getResults()) {
				this.handlePickupableEntity(entity, dt);
			}
		});

		this.queries.pickupableObjects.resultAdded.Connect((entity) => {
			if (!entity.Instance.IsA("Model") || !entity.Instance.PrimaryPart) {
				entity.removeComponent(Pickupable);
				error(
					"Pickupable component was assigned to something that wasn't a model or didn't have a primarypart",
				);
			}

			const pickupableComp = entity.getComponent(Pickupable);

			pickupableComp.interval = 1;
			pickupableComp.elapsedTime = 0;
		});
	}

	handlePickupableEntity(entity: Framework.Entity<Model>, dt: number) {
		const pickupableComp = entity.getComponent(Pickupable);

		if (
			pickupableComp.elapsedTime === undefined ||
			pickupableComp.interval === undefined ||
			entity.Instance.PrimaryPart === undefined
		) {
			return;
		}

		pickupableComp.elapsedTime += dt;

		if (pickupableComp.elapsedTime >= pickupableComp.interval) {
			const charPrimaryPart = this.localPlayer.Character?.PrimaryPart;

			if (!charPrimaryPart) {
				return;
			}

			pickupableComp.elapsedTime = 0;

			const entityPos = entity.Instance.PrimaryPart.Position;
			const relative = entityPos.sub(charPrimaryPart.Position);
			const distance = relative.Magnitude;

			const viewingScore = this.viewingRangeScore(charPrimaryPart, relative);

			print(viewingScore);

			pickupableComp.interval = this.getCheckingInterval(distance);
		}
	}

	viewingRangeScore(charPrimaryPart: BasePart, relative: Vector3) {
		const forward = charPrimaryPart.CFrame.LookVector;
		const side = relative.Unit;
		const theta = math.deg(math.acos(forward.Dot(side)));
	}

	getCheckingInterval(distance: number) {
		return math.clamp(distance / 10, MINIMUM_INTERVAl, MAXIMUM_INTERVAL);
	}

	queries = {
		pickupableObjects: new Framework.Query<Model>([Pickupable]),
	};
}
