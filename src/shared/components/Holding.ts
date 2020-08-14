import * as Framework from "Framework";

export class Holding extends Framework.Component {
	holdingModel = new Framework.RemoteProperty({
		name: "holdingModel",
		component: this,
		propertyType: "Instance",
	});

	holdingAnimation?: AnimationTrack;

	welds: Array<ManualWeld> = [];

	constructor(entity: Framework.Entity<Player>) {
		super(entity);
	}
}
