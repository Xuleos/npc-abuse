import * as Framework from "Framework";
/**
 * Used for storing a ref to a character humanoid so we don't have to constantly make sure one is there and stuff
 * @param humanoid
 */
export class HumanoidRef extends Framework.Component {
	constructor(entity: Framework.Entity<Model>, public humanoid: Humanoid) {
		super(entity);
	}
}
