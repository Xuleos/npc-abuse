interface Input {
	imageRectOffset: Vector2;
	imageRectSize: Vector2;
	keycode: Enum.KeyCode;
}

export interface InputWithImage extends Input {
	image: string;
}

interface IInputs {
	light: {
		[index: string]: InputWithImage;
	};
	dark: {
		[index: string]: InputWithImage;
	};
}

const inputImages: {
	[index: string]: Input;
} = {};

//Is there a clearer way to do these? Help me
function mapInputsToTheme(image: string) {
	const clone: {
		[index: string]: Input & {
			image?: string;
		};
	} = Object.deepCopy(inputImages);

	for (const key of Object.keys(clone)) {
		clone[key]["image"] = image;
	}

	return clone as {
		[index: string]: InputWithImage;
	};
}

const light: IInputs["light"] = mapInputsToTheme("rbxassetid://1244653012");

const dark: IInputs["dark"] = mapInputsToTheme("rbxassetid://1244652930");

const Inputs: IInputs = {
	light: light,
	dark: dark,
};

export default Inputs;
