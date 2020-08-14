import * as Framework from "Framework";
import * as Roact from "@rbxts/roact";
import Net from "@rbxts/net";

import Inputs from "client/modules/Inputs";
import Action from "../Action";
import { Players } from "@rbxts/services";
import { Holding } from "shared/components/Holding";

const pickUpEvent = new Net.ClientEvent("PickUp");

interface PickupDisplayProps {}

interface PickupDisplayState {
	object?: BasePart;
	holdingObject?: Instance;
}

export default class PickupDisplay extends Roact.Component<PickupDisplayProps, PickupDisplayState> {
	render() {
		let enabled = true;

		if (this.state.object && this.state.holdingObject === this.state.object.Parent) {
			enabled = false;
		}

		return (
			<Action
				name={"Pick Up"}
				input={Inputs.light.E}
				object={this.state.object}
				enabled={enabled}
				func={() => {
					const object = this.state.object;

					if (this.state.holdingObject) {
						if (!object || object === this.state.holdingObject) {
							pickUpEvent.SendToServer(undefined);
							return;
						}
					}

					if (object && object.Parent && object.Parent.IsA("Model")) {
						pickUpEvent.SendToServer(object.Parent);
					}
				}}
			/>
		);
	}

	didMount() {
		Framework.ClientSystems.PickupDisplaySystem.closestObjectChanged.Connect((model) => {
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

		const player = Players.LocalPlayer;
		const playerEntity = Framework.mallow.fetchEntity(player);

		if (!playerEntity.hasComponent(Holding)) {
			error("Local player does not have holding component");
		}

		const holdingComp = playerEntity.getComponent(Holding);

		holdingComp.holdingModel.changed.Connect((newVal) => {
			if (newVal) {
				this.setState({
					holdingObject: newVal,
				});
			} else {
				this.setState({
					holdingObject: Roact.None,
				});
			}
		});
	}
}
