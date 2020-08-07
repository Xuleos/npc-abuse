import * as Framework from "Framework";
import Net from "@rbxts/net";
import t from "@rbxts/t";
import { Pickupable, weldInfoType } from "shared/components/Pickupable";
import { Players } from "@rbxts/services";
import { Holding } from "shared/components/Holding";

const pickUpEvent = new Net.ServerEvent("PickUp", t.optional(t.instanceIsA("Model")));

export class PickupSystem extends Framework.ServerSystem {
	start() {
		pickUpEvent.Connect((player, instance) => {
			const playerEntity = Framework.mallow.fetchEntity(player);
			const holdingComp = playerEntity.getComponent(Holding);

			if (!instance) {
				this.removeCurrentHolding(holdingComp);
				return;
			}

			if (!instance.PrimaryPart) {
				return;
			}

			const char = player.Character;
			if (!char || !char.PrimaryPart) {
				//Player's character does not exist or they don't have a primary part, so we shouldn't do anything
				return;
			}

			const instEntity = Framework.mallow.getEntity(instance);
			if (!instEntity || !instEntity.hasComponent(Pickupable)) {
				//Client fired with something that can't be picked up
				return;
			}

			const pickupableComp = instEntity.getComponent(Pickupable);

			if (!pickupableComp.weldInfo) {
				return;
			}

			this.removeCurrentHolding(holdingComp);

			const weld = this.weldItemToPlayer(instance, pickupableComp.weldInfo, char);
			holdingComp.welds.push(weld);

			holdingComp.holdingModel.set(instance);
		});

		Players.PlayerAdded.Connect((player) => {
			const playerEntity = Framework.mallow.fetchEntity(player);
			playerEntity.addComponent(new Holding(playerEntity));
		});
	}

	weldItemToPlayer(instance: Required<Model>, weldInfo: weldInfoType, char: Required<Model>) {
		const weld = new Instance("ManualWeld");
		weld.Parent = instance.PrimaryPart;
		weld.Part0 = instance.PrimaryPart;
		weld.Part1 = char.PrimaryPart;
		weld.C0 = weldInfo.C0;

		return weld;
	}

	removeCurrentHolding(holdingComp: Holding) {
		const holdingModel = holdingComp.holdingModel.get();

		if (holdingModel) {
			for (const weld of holdingComp.welds) {
				weld.Destroy();
			}

			holdingComp.holdingModel.set(undefined);
		}
	}

	queries = {};
}
