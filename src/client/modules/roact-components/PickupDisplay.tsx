import * as Roact from "@rbxts/roact";
import { ThemeContext } from "./ThemeProvider";

interface PickupDisplayProps {}

export default class PickupDisplay extends Roact.PureComponent<PickupDisplayProps> {
	render() {
		return (
			<ThemeContext.Consumer
				render={(theme) => {
					return <billboardgui LightInfluence={0} ResetOnSpawn={false}></billboardgui>;
				}}
			/>
		);
	}
}
