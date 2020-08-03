import * as Framework from "Framework";

export class Debris extends Framework.Component {
	elapsedTime = 0;
	constructor(entity: Framework.Entity<Instance>, public duration = 60) {
		super(entity);
	}
}
