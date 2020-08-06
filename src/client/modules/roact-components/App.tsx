import * as Roact from "@rbxts/roact";
import ThemeProvider from "./ThemeProvider";
import PickupDisplay from "./PickupDisplay";

interface AppProps {}

export default class App extends Roact.PureComponent<AppProps> {
	render() {
		return (
			<ThemeProvider>
				<PickupDisplay />
			</ThemeProvider>
		);
	}
}
