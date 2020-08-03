import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { femaleHairs, maleHairs, maleShirts, femaleShirts, pants, skinColors } from "./npcAssets";

const random = new Random();
export function createNpc(position: Vector3) {
	const dummy = ReplicatedStorage.assets.Dummy.Clone();

	const description = new Instance("HumanoidDescription");

	const gender = random.NextInteger(0, 1) === 0 ? "Male" : "Female";

	const hairsForGender = gender === "Male" ? maleHairs : femaleHairs;
	const hairId = hairsForGender[random.NextInteger(0, hairsForGender.size() - 1)];
	description.HairAccessory = tostring(hairId);

	const shirtsForGender = gender === "Male" ? maleShirts : femaleShirts;
	const shirtId = shirtsForGender[random.NextInteger(0, shirtsForGender.size() - 1)];
	description.Shirt = shirtId;

	const pantsId = pants[random.NextInteger(0, pants.size() - 1)];
	description.Pants = pantsId;

	const color = skinColors[random.NextInteger(0, skinColors.size() - 1)];
	description.HeadColor = color;
	description.TorsoColor = color;
	description.LeftArmColor = color;
	description.LeftLegColor = color;
	description.RightArmColor = color;
	description.RightLegColor = color;

	const humanoid = dummy.WaitForChild("Humanoid") as Humanoid;

	const hipHeight = new Vector3(0, humanoid.HipHeight, 0);
	dummy.SetPrimaryPartCFrame(new CFrame(position.add(hipHeight)));

	dummy.Parent = Workspace;

	humanoid.ApplyDescription(description);
	description.Destroy();
}
