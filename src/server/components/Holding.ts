import * as Framework from "Framework";

export class Holding extends Framework.Component {
	model = new Framework.RemoteProperty({
		name: "HoldingModel",
		component: this,
		propertyType: "Instance",
	});

	constructor(entity: Framework.Entity<Instance>) {
		super(entity);
	}
}
