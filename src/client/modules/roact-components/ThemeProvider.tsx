import Roact from "@rbxts/roact";

export interface Theme {
	colors: {
		background: Color3;
		primary: Color3;
		secondary: Color3;
	};
}

const defaultTheme: Theme = {
	colors: {
		background: Color3.fromRGB(32, 36, 42),
		primary: Color3.fromRGB(32, 201, 151),
		secondary: Color3.fromRGB(132, 94, 247),
	},
};

export const ThemeContext = Roact.createContext(defaultTheme);

interface ThemeProviderProps {
	theme?: Theme;
}

export default class ThemeProvider extends Roact.PureComponent<ThemeProviderProps> {
	constructor(props: ThemeProviderProps) {
		super(props);
	}

	render(): Roact.Element {
		return <ThemeContext.Provider value={this.props.theme}>{this.props[Roact.Children]}</ThemeContext.Provider>;
	}
}
