import * as Framework from "Framework";
import { RunService, Players } from "@rbxts/services";

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

	localPlayer = Players.LocalPlayer;

	start() {
		RunService.Heartbeat.Connect((dt) => {
			for (const entity of this.queries.pickupableObjects.getResults()) {
				this.handlePickupableEntity(entity, dt);
			}
		});

		this.queries.pickupableObjects.resultAdded.Connect((entity) => {
			const isAModel = entity.Instance.IsA("Model");
			const hasPrimaryPart = entity.Instance.PrimaryPart !== undefined;

			if (!isAModel) {
				entity.removeComponent(Pickupable);
				error(`Pickupable component was added to a ${entity.Instance.ClassName} when it should be a Model`);
			}

			if (!hasPrimaryPart) {
				entity.removeComponent(Pickupable);
				error(`Pickupable component was added to a model without a primary part`);
			}

			const pickupableComp = entity.getComponent(Pickupable);

			pickupableComp.interval = MINIMUM_INTERVAl;
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

			pickupableComp.interval = this.getCheckingInterval(distance);

			if (distance <= MINIMUM_RADIUS) {
				const viewingScore = this.viewingRangeScore(charPrimaryPart, relative);

				if (viewingScore <= MINIMUM_VIEW_RANGE) {
					//epic you are eligible to be evaluated my good pickupable object
					this.evaluateOverCurrent(entity, charPrimaryPart, viewingScore, distance);
				}
			}
		}
	}

	evaluateOverCurrent(
		entity: Framework.Entity<Model>,
		charPrimaryPart: BasePart,
		viewingScore: number,
		distance: number,
	) {
		//Update distance and viewing
		if (this.closestObject !== undefined) {
			const objPosition = this.closestObject.model.PrimaryPart?.Position;

			if (!objPosition) {
				this.closestObject = undefined;
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
				this.closestObject = undefined;
			}
		}

		const currentViewingScore = this.closestObject !== undefined ? this.closestObject.viewingScore : 360;
		const currentDistance = this.closestObject !== undefined ? this.closestObject.distanceFromChar : 99999;

		if (viewingScore < currentViewingScore && distance < currentDistance) {
			this.closestObject = {
				model: entity.Instance,
				viewingScore: viewingScore,
				distanceFromChar: distance,
			};

			print(this.closestObject.model);
		}
	}

	viewingRangeScore(charPrimaryPart: BasePart, relative: Vector3) {
		const forward = charPrimaryPart.CFrame.LookVector;
		const side = relative.Unit;
		const theta = math.deg(math.acos(forward.Dot(side)));

		return theta;
	}

	getCheckingInterval(distance: number) {
		return math.clamp(distance / 15, MINIMUM_INTERVAl, MAXIMUM_INTERVAL);
	}

	queries = {
		pickupableObjects: new Framework.Query<Model>([Pickupable]),
	};
}
