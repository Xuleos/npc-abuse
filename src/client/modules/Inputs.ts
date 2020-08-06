export interface Input {
	image: string;
	imageRectOffset: Vector2;
	imageRectSize: Vector2;
	keycode: Enum.KeyCode;
}

//help i suck at types like this
type keynames = "E";
interface IInputs {
	light: {
		[index in keynames]: Input;
	};
	dark: {
		[index in keynames]: Input;
	};
}

const light: IInputs["light"] = {
	E: {
		image: "rbxassetid://1244653012",
		imageRectOffset: new Vector2(800, 200),
		imageRectSize: new Vector2(100, 100),
		keycode: Enum.KeyCode.E,
	},
};

const dark: IInputs["dark"] = {
	E: {
		image: "rbxassetid://1244652930",
		imageRectOffset: new Vector2(800, 200),
		imageRectSize: new Vector2(100, 100),
		keycode: Enum.KeyCode.E,
	},
};

const Inputs: IInputs = {
	light: light,
	dark: dark,
};

export default Inputs;
