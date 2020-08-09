import * as Framework from "Framework";
import { RunService } from "@rbxts/services";

export type weldInfoType = {
	c0: CFrame;
	animation?: Animation;
};

export class Pickupable extends Framework.Component {
	elapsedTime?: number;
	interval?: number;

	weldInfo?: weldInfoType;

	constructor(entity: Framework.Entity<Model>) {
		super(entity);

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

		if (RunService.IsClient()) {
			this.interval = 0.5;
			this.elapsedTime = 0;
		}
	}
}
