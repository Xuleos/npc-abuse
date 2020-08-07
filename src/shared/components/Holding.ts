import * as Framework from "Framework";

export class Holding extends Framework.Component {
	holdingModel = new Framework.RemoteProperty({
		name: "holdingModel",
		component: this,
		propertyType: "Instance",
	});

	welds: Array<ManualWeld> = [];

	constructor(entity: Framework.Entity<Instance>) {
		super(entity);
	}
}
