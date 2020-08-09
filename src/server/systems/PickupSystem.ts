import * as Framework from "Framework";
import Net from "@rbxts/net";
import t from "@rbxts/t";
import { Pickupable, weldInfoType } from "shared/components/Pickupable";
import { Players } from "@rbxts/services";
import { Holding } from "shared/components/Holding";
import { AnimController } from "shared/components/AnimController";

const pickUpEvent = new Net.ServerEvent("PickUp", t.optional(t.instanceIsA("Model")));

export class PickupSystem extends Framework.ServerSystem {
	start() {
		pickUpEvent.Connect((player, instance) => {
			const playerEntity = Framework.mallow.fetchEntity(player);
			const holdingComp = playerEntity.getComponent(Holding);

			//put down whatever they were holding (break welds and stuff) if fired without an instance
			if (!instance) {
				this.removeCurrentHolding(holdingComp);
				return;
			}

			if (!instance.PrimaryPart) {
				return;
			}

			const char = player.Character;

			if (!char || !char.PrimaryPart) {
				return;
			}

			const instEntity = Framework.mallow.getEntity(instance);
			if (!instEntity || !instEntity.hasComponent(Pickupable)) {
				//Client fired with something that can't be picked up. Return
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

			//Everything after this comment is responsible for animation thingys
			const charEntity = Framework.mallow.getEntity(char);

			if (charEntity && charEntity.hasComponent(AnimController)) {
				const animControllerComp = charEntity.getComponent(AnimController);

				this.playHoldingAnimation(animControllerComp, holdingComp, pickupableComp.weldInfo);
			}
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

		weld.C0 = weldInfo.c0;

		return weld;
	}

	playHoldingAnimation(animController: AnimController, holdingComp: Holding, weldInfo: weldInfoType) {
		if (weldInfo.animation === undefined) {
			return;
		}

		if (holdingComp.holdingAnimation !== undefined) {
			error("There's already a holding animation track and it hasn't been cleaned yet");
		}

		const animTrack = animController.instance.LoadAnimation(weldInfo.animation);
		animTrack.Play();

		holdingComp.holdingAnimation = animTrack;
	}

	stopHoldingAnimation(holdingComp: Holding) {
		if (!holdingComp.holdingAnimation) {
			return;
		}

		holdingComp.holdingAnimation.Stop();

		holdingComp.holdingAnimation.Destroy();
		holdingComp.holdingAnimation = undefined;
	}

	removeCurrentHolding(holdingComp: Holding) {
		const holdingModel = holdingComp.holdingModel.get();

		if (holdingModel) {
			for (const weld of holdingComp.welds) {
				weld.Destroy();
			}

			holdingComp.welds = [];

			holdingComp.holdingModel.set(undefined);

			this.stopHoldingAnimation(holdingComp);
		}
	}

	queries = {};
}
