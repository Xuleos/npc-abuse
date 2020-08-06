import * as Framework from "Framework";
import Net from "@rbxts/net";
import t from "@rbxts/t";
import { Pickupable } from "shared/components/Pickupable";

const pickUpEvent = new Net.ServerEvent("PickUp", t.instanceIsA("Model"));

export class PickupSystem extends Framework.ServerSystem {
	start() {
		pickUpEvent.Connect((player, instance) => {
			if (!instance.PrimaryPart) {
				return;
			}

			const char = player.Character;
			if (!char || !char.PrimaryPart) {
				//Player's character does not exist or they don't have a primary part, so we shouldn't do anything
				return;
			}

			const entity = Framework.mallow.getEntity(instance);
			if (!entity || !entity.hasComponent(Pickupable)) {
				//Client fired with something that can't be picked up
				return;
			}

			const pickupableComp = entity.getComponent(Pickupable);

			if (!pickupableComp.weldInfo) {
				return;
			}

			const weld = new Instance("ManualWeld");
			weld.Parent = instance.PrimaryPart;
			weld.Part0 = instance.PrimaryPart;
			weld.Part1 = char.PrimaryPart;

			weld.C0 = pickupableComp.weldInfo.C0;
		});
	}

	queries = {};
}
