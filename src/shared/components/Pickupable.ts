import * as Framework from "Framework";

export class Pickupable extends Framework.Component {
	elapsedTime?: number;
	interval?: number;
	constructor(entity: Framework.Entity<Instance>) {
		super(entity);
	}
}
