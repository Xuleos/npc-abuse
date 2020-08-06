import Framework from "Framework";
import * as Roact from "@rbxts/roact";

import Inputs from "client/modules/Inputs";
import Action from "../Action";

interface PickupDisplayProps {}

interface PickupDisplayState {
	object?: BasePart;
}

export default class PickupDisplay extends Roact.PureComponent<PickupDisplayProps, PickupDisplayState> {
	constructor(props: PickupDisplayProps) {
		super(props);
	}

	render() {
		return <Action name={"Pick Up"} input={Inputs.light.E} object={this.state.object} />;
	}

	didMount() {
		Framework.ClientSystems.PickupSystem.closestObjectChanged.Connect((model) => {
			if (model) {
				this.setState({
					object: model.PrimaryPart,
				});
			} else {
				this.setState({
					object: Roact.None,
				});
			}
		});
	}
}
