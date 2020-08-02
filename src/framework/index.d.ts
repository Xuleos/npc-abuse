
//THIS IS SO OLD PLEASE LEAVE THIS FILE
import Signal from "@rbxts/signal";

declare namespace Framework {
	abstract class IComponent {
		update<T extends this, K extends keyof T>(member: keyof T, value: T[K]): void;

		entity: Entity<Instance>;

		constructor(entity: Entity<Instance>);
	}

	abstract class Component extends IComponent {
		constructor(entity: Entity<Instance>);
	}

	interface Entity<T> {
		Instance: T;

		/**
		 * @param component class
		 * @returns the component instance or undefined
		 */
		getComponent<O extends IComponent, K = ConstructorParameters<{ new (): O }>>(component: new (args: K) => O): O;

		waitForComponentAsync<O extends Component>(component: new () => O): Promise<O>;

		hasComponent<O extends IComponent, K = ConstructorParameters<{ new (): O }>, B = new (args: K) => O>(
			component: B,
		): boolean;

		addComponent<T extends Component>(component: T): T;

		removeComponent<O extends IComponent, K = ConstructorParameters<{ new (): O }>, B = new (args: K) => O>(
			component: B,
		): void;

		id: string;
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

	const Mallow: Mallow;

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
}
export = Framework;
