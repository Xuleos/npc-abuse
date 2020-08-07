import * as Roact from "@rbxts/roact";
import { ThemeContext } from "../ThemeProvider";
import ActionInfo from "../Action/ActionInfo";
import { Input } from "client/modules/Inputs";
import { UserInputService } from "@rbxts/services";

interface ActionProps {
	name: string;
	input: Input;
	object?: BasePart;
	enabled?: boolean;
	func?: () => void;
}

export default class Action extends Roact.PureComponent<ActionProps> {
	inputBeganConnection?: RBXScriptConnection;

	constructor(props: ActionProps) {
		super(props);
	}

	render() {
		return (
			<ThemeContext.Consumer
				render={(theme) => {
					const enabled = this.props.object !== undefined ? this.props.enabled : false;

					const sizeX = 5;
					const sizeY = 1.5;

					return (
						<billboardgui
							Adornee={this.props.object}
							Enabled={enabled}
							LightInfluence={0}
							AlwaysOnTop={true}
							ResetOnSpawn={false}
							Size={new UDim2(sizeX, 0, sizeY, 0)}
							StudsOffsetWorldSpace={new Vector3(0, 0, 0)}
						>
							<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={theme.colors.primary}>
								<uicorner CornerRadius={new UDim(0.5, 0)} />

								<ActionInfo
									name={this.props.name}
									input={this.props.input}
									inputImageRatio={sizeY / sizeX}
								/>
							</frame>
						</billboardgui>
					);
				}}
			/>
		);
	}

	didMount() {
		this.inputBeganConnection = UserInputService.InputBegan.Connect((inputObj, gameProcessed) => {
			if (!gameProcessed && inputObj.KeyCode === this.props.input.keycode) {
				if (this.props.func) {
					this.props.func();
				}
			}
		});
	}

	willUnmount() {
		if (this.inputBeganConnection) {
			this.inputBeganConnection.Disconnect();
		}
	}
}
