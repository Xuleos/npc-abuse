import * as Roact from "@rbxts/roact";
import { ThemeContext } from "../ThemeProvider";
import Action from "./Action";
import Inputs from "client/modules/Inputs";

interface PickupDisplayProps {
	Adornee: BasePart | Attachment;
}

export default class PickupDisplay extends Roact.PureComponent<PickupDisplayProps> {
	render() {
		return (
			<ThemeContext.Consumer
				render={(theme) => {
					const sizeX = 5;
					const sizeY = 1.5;
					return (
						<billboardgui
							Adornee={this.props.Adornee}
							LightInfluence={0}
							AlwaysOnTop={true}
							ResetOnSpawn={false}
							Size={new UDim2(sizeX, 0, sizeY, 0)}
							StudsOffsetWorldSpace={new Vector3(0, 0, 0)}
						>
							<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={theme.colors.primary}>
								<uicorner CornerRadius={new UDim(0.5, 0)} />

								<Action name={"Pick Up"} input={Inputs.light.E} inputImageRatio={sizeY / sizeX} />
							</frame>
						</billboardgui>
					);
				}}
			/>
		);
	}
}
