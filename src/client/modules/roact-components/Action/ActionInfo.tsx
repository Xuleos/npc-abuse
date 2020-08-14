import * as Roact from "@rbxts/roact";
import { Input } from "client/modules/Inputs";

interface ActionProps {
	name: string;
	input: Input;
	inputImageRatio: number;
}
/**
 * Shows the button to press for the action to happen and what the action is
 */
export default class ActionInfo extends Roact.Component<ActionProps> {
	render() {
		const yScale = 0.8;
		const xScale = yScale * 0.3;
		const xPaddingScale = 0.025;

		return (
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(xScale / 2 + xPaddingScale, 0, 0.5, 0)}
				Size={new UDim2(xScale, 0, yScale, 0)}
				BackgroundTransparency={1}
				Image={this.props.input.image}
				ImageRectOffset={this.props.input.imageRectOffset}
				ImageRectSize={this.props.input.imageRectSize}
			>
				<textlabel
					AnchorPoint={new Vector2(0, 0.5)}
					Size={new UDim2(2.5, 0, 0.6, 0)}
					Position={new UDim2(1, 0, 0.5, 0)}
					BackgroundTransparency={1}
					Text={this.props.name}
					Font={"SourceSansSemibold"}
					TextColor3={new Color3(1, 1, 1)}
					TextXAlignment={"Left"}
					TextScaled={true}
				/>
			</imagelabel>
		);
	}
}
