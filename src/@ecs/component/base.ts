export type InferSchemaArray<T extends readonly unknown[]> = {
  [K in keyof T]: InferSchema<T[K]>;
};
export type InferSchema<T> = T extends Component<infer U> ? U : never;

export type AnyComponent = Component<unknown>;
export type AnyComponentData = ComponentData<unknown>;

export interface ComponentData<T> {
  component: Component<T>;
  data: T;
}

export abstract class Component<T> {
  // just for the type
  readonly Data: ComponentData<T> = undefined as unknown as any;
  readonly id = Symbol();

  create(data: T): ComponentData<T> {
    return {
      component: this,
      data,
    };
  }
  createRef(data: { current: T }): ComponentData<T> {
    return {
      component: this,
      get data() {
        return data.current;
      },
    };
  }

  serialize(data: T): string {
    return JSON.stringify(data);
  }
  deserialize(data: string): T {
    return this.validate(JSON.parse(data));
  }

  abstract validate(data: unknown): T;
}
