import * as Framework from "Framework";
import Net from "@rbxts/net";
import t from "@rbxts/t";
import { Pickupable, weldInfoType } from "shared/components/Pickupable";
import { Players } from "@rbxts/services";
import { Holding } from "shared/components/Holding";
import { HumanoidRef } from "shared/components/HumanoidRef";
import yieldForR15CharacterDescendants from "@rbxts/yield-for-character";

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

			const upperTorso = char.FindFirstChild("UpperTorso");
			if (!upperTorso || !upperTorso.IsA("BasePart")) {
				warn("Character does not have an upper torso");
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

			const weld = this.weldItemToPlayer(instance, pickupableComp.weldInfo, upperTorso);
			holdingComp.welds.push(weld);

			holdingComp.holdingModel.set(instance);

			//Everything after this comment is responsible for animation thingys
			const charEntity = Framework.mallow.getEntity(char);

			if (charEntity && charEntity.hasComponent(HumanoidRef)) {
				//why do I have to use this assert here wth? Can somebody tell me what's wrong with my types?
				const humRefComp = charEntity.getComponent(HumanoidRef as new () => HumanoidRef);

				this.playHoldingAnimation(humRefComp, holdingComp, pickupableComp.weldInfo);
			}
		});

		Players.PlayerAdded.Connect((player) => {
			const playerEntity = Framework.mallow.fetchEntity(player);
			playerEntity.addComponent(new Holding(playerEntity));

			player.CharacterAdded.Connect((model) => {
				yieldForR15CharacterDescendants(model).then((char) => {
					const charEntity = Framework.mallow.fetchEntity(model);

					charEntity.addComponent(new HumanoidRef(charEntity, char.Humanoid));
				});
			});
		});
	}

	/**
	 * Creates a really simple weld between the item and the player's upper torso
	 * @param instance
	 * @param weldInfo
	 * @param upperTorso
	 * @returns the weld it creates
	 */
	weldItemToPlayer(instance: Required<Model>, weldInfo: weldInfoType, upperTorso?: BasePart) {
		const weld = new Instance("ManualWeld");
		weld.Parent = instance.PrimaryPart;

		weld.Part0 = instance.PrimaryPart;
		weld.Part1 = upperTorso;

		weld.C0 = weldInfo.c0;

		const humanoid = instance.FindFirstChildOfClass("Humanoid");
		if (humanoid) {
			humanoid.PlatformStand = true;
		}

		return weld;
	}

	playHoldingAnimation(humRef: HumanoidRef, holdingComp: Holding, weldInfo: weldInfoType) {
		if (weldInfo.animation === undefined) {
			return;
		}

		if (holdingComp.holdingAnimation !== undefined) {
			error("There's already a holding animation track and it hasn't been cleaned yet");
		}

		const animTrack = humRef.humanoid.LoadAnimation(weldInfo.animation);
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

	/**
	 * Puts down whatever the player is currently holding and cleans up everything
	 * @param holdingComp
	 */
	removeCurrentHolding(holdingComp: Holding) {
		const holdingModel = holdingComp.holdingModel.get();

		if (holdingModel) {
			for (const weld of holdingComp.welds) {
				weld.Destroy();
			}

			holdingComp.welds = [];

			const humanoid = holdingModel.FindFirstChildOfClass("Humanoid");
			if (humanoid) {
				humanoid.PlatformStand = false;
			}

			holdingComp.holdingModel.set(undefined);

			this.stopHoldingAnimation(holdingComp);
		}
	}

	queries = {};
}
