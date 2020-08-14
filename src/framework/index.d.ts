//THIS IS SO OLD PLEASE LEAVE ME ALONE
import Signal from "@rbxts/signal";

declare namespace Framework {
	// strongly regret having components as classes

	abstract class Component {
		entity: Entity<Instance>;

		constructor(entity: Entity<Instance>);
	}

	interface Entity<T> {
		Instance: T;

		/**
		 * @param component class
		 * @returns the component instance or undefined
		 */
		getComponent<C extends Component, P = ConstructorParameters<{ new (): C }>>(component: new (args: P) => C): C;

		hasComponent<C extends Component, P = ConstructorParameters<{ new (): C }>, B = new (args: P) => C>(
			component: B,
		): boolean;

		addComponent<C extends Component>(component: C): C;

		removeComponent<C extends Component, P = ConstructorParameters<{ new (): C }>, B = new (args: P) => C>(
			component: B,
		): void;
	}

	interface Mallow {
		getEntity<T>(instance: T): Entity<T> | undefined;

		fetchEntity<T>(instance: T): Entity<T>;

		killEntity<T>(instance: T): void;

		createEntity<T>(instance: T): Entity<T>;
	}

	class Query<T extends Instance> {
		constructor(components: Array<object>);
		getResults(): Array<Entity<T>>;
		getFirst(): Entity<T> | undefined;
		resultAdded: Signal<(Entity: Entity<T>) => void>;
		resultRemoved: Signal<(Entity: Entity<T>) => void>;
	}

	interface Queries {
		[key: string]: Query<Instance>;
	}

	const mallow: Mallow;

	abstract class ServerSystem {
		public disabled?: boolean;

		abstract start(): void;

		protected systems: GlobalServerSystems;
		protected mallow: Mallow;

		abstract queries: Queries;
	}

	abstract class ClientSystem {
		public disabled?: boolean;

		abstract start(): void;

		protected systems: GlobalClientSystems;
		protected mallow: Mallow;

		abstract queries: Queries;
	}

	abstract class SharedSystem {
		public disabled?: boolean;

		abstract start(): void;

		protected mallow: Mallow;

		abstract queries: Queries;
	}

	const ServerSystems: GlobalServerSystems;
	const ClientSystems: GlobalClientSystems;

	type SupportedPropertyTypes = "string" | "boolean" | "number" | "integer" | "Instance" | "Color3" | "Vector3";
	type TypeFromName<T> = T extends "string"
		? string
		: T extends "number"
		? number
		: T extends "boolean"
		? boolean
		: T extends "number"
		? number
		: T extends "integer"
		? number
		: T extends "Instance"
		? Instance
		: T extends "Color3"
		? Color3
		: T extends "Vector3"
		? Vector3
		: undefined;

	class RemoteProperty<N extends SupportedPropertyTypes, T extends TypeFromName<N>> {
		constructor(args: { name: string; component: Component; propertyType: N; initialValue?: T });

		get(): T;

		set<O extends T | undefined>(val: O): O;

		changed: Signal<(thing: T | undefined) => void>;
	}
}
export = Framework;
