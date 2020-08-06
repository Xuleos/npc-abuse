import * as Framework from "Framework";
import { RunService, Players } from "@rbxts/services";
import Signal from "@rbxts/signal";

import { Pickupable } from "shared/components/Pickupable";

const MINIMUM_INTERVAl = 0.1;
const MAXIMUM_INTERVAL = 5;

const MINIMUM_RADIUS = 10;
const MINIMUM_VIEW_RANGE = 90;

export class PickupSystem extends Framework.ClientSystem {
	closestObject?: {
		model: Model;
		viewingScore: number;
		distanceFromChar: number;
	};
	closestObjectChanged = new Signal<(model?: Model) => void>();

	localPlayer = Players.LocalPlayer;

	start() {
		RunService.Heartbeat.Connect((dt) => {
			for (const entity of this.queries.pickupableObjects.getResults()) {
				this.handlePickupableEntity(entity, dt);
			}
		});
	}

	changeClosestObject(this: PickupSystem, newClosestObject: typeof this.closestObject) {
		this.closestObject = newClosestObject;
		this.closestObjectChanged.Fire(newClosestObject !== undefined ? newClosestObject.model : undefined);
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
			const char = this.localPlayer.Character;
			const charPrimaryPart = char !== undefined ? char.PrimaryPart : undefined;

			if (!charPrimaryPart) {
				return;
			}

			if (this.closestObject && this.closestObject.model === entity.Instance) {
				this.updateCurrent(charPrimaryPart);
			}

			pickupableComp.elapsedTime = 0;

			const entityPos = entity.Instance.PrimaryPart.Position;
			const relative = entityPos.sub(charPrimaryPart.Position);
			const distance = relative.Magnitude;

			pickupableComp.interval = this.getCheckingInterval(distance);

			if (distance <= MINIMUM_RADIUS) {
				const viewingScore = this.viewingRangeScore(charPrimaryPart, relative);

				if (viewingScore <= MINIMUM_VIEW_RANGE) {
					//epic you are eligible to be evaluated my good pickupable object
					this.evaluateOverCurrent(entity, viewingScore, distance);
				}
			}
		}
	}

	updateCurrent(charPrimaryPart: BasePart) {
		//Update distance and viewing
		if (this.closestObject !== undefined) {
			const objPrimaryPart = this.closestObject.model.PrimaryPart;
			const objPosition = objPrimaryPart !== undefined ? objPrimaryPart.Position : undefined;

			if (!objPosition) {
				this.changeClosestObject(undefined);
				error("current object does not have a primary part");
			}

			const newRelative = objPosition.sub(charPrimaryPart.Position);
			const newViewingScore = this.viewingRangeScore(charPrimaryPart, newRelative);

			this.closestObject.distanceFromChar = newRelative.Magnitude;
			this.closestObject.viewingScore = newViewingScore;

			if (
				this.closestObject.distanceFromChar > MINIMUM_RADIUS ||
				this.closestObject.viewingScore > MINIMUM_VIEW_RANGE
			) {
				this.changeClosestObject(undefined);
			}
		}
	}

	evaluateOverCurrent(entity: Framework.Entity<Model>, viewingScore: number, distance: number) {
		const currentViewingScore = this.closestObject !== undefined ? this.closestObject.viewingScore : 360;
		const currentDistance = this.closestObject !== undefined ? this.closestObject.distanceFromChar : 99999;

		if (viewingScore < currentViewingScore && distance < currentDistance) {
			this.changeClosestObject({
				model: entity.Instance,
				viewingScore: viewingScore,
				distanceFromChar: distance,
			});
		}
	}

	viewingRangeScore(charPrimaryPart: BasePart, relative: Vector3) {
		const forward = charPrimaryPart.CFrame.LookVector;
		const side = relative.Unit;
		const theta = math.deg(math.acos(forward.Dot(side)));

		return theta;
	}

	getCheckingInterval(distance: number) {
		return math.clamp(distance / 30, MINIMUM_INTERVAl, MAXIMUM_INTERVAL);
	}

	queries = {
		pickupableObjects: new Framework.Query<Model>([Pickupable]),
	};
}
