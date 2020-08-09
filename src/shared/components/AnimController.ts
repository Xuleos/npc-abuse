import * as Framework from "Framework";

export class AnimController extends Framework.Component {
	instance: AnimationController;
	constructor(entity: Framework.Entity<Instance>) {
		super(entity);

		this.instance = new Instance("AnimationController");
		this.instance.Parent = entity.Instance;
	}
}
