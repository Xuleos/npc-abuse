import * as Roact from "@rbxts/roact";
import { ThemeContext } from "../ThemeProvider";
import { eKey } from "client/modules/Inputs";

interface PickupDisplayProps {
	Adornee: BasePart | Attachment;
}

export default class PickupDisplay extends Roact.PureComponent<PickupDisplayProps> {
	render() {
		return (
			<ThemeContext.Consumer
				render={(theme) => {
					return (
						<billboardgui
							Adornee={this.props.Adornee}
							LightInfluence={0}
							AlwaysOnTop={true}
							ResetOnSpawn={false}
							Size={new UDim2(5, 0, 1.5, 0)}
							StudsOffsetWorldSpace={new Vector3(0, 0, 0)}
						>
							<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={theme.colors.primary}>
								<uicorner CornerRadius={new UDim(0.5, 0)} />

								<imagelabel
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={new UDim2(0, 0, 0.5, 0)}
									Size={new UDim2(0, 30, 0, 30)}
									Image={eKey.Image}
									ImageRectOffset={eKey.ImageRectOffset}
									ImageRectSize={eKey.ImageRectSize}
								/>
							</frame>
						</billboardgui>
					);
				}}
			/>
		);
	}
}
