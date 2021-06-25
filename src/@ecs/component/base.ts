export type InferSchemaArray<T> = {
  [K in keyof T]: K extends number ? InferSchema<T[K]> : never;
};
export type InferSchema<T> = T extends Component<infer U> ? U : never;

export type AnyComponent = Component<unknown>;
export type AnyComponentData = ComponentData<unknown>;

export interface ComponentData<T> {
  component: Component<T>;
  data: T;
}

export abstract class Component<T> {
  private static GlobalComponentId = 0;

  // just for the type
  readonly Data: ComponentData<T> = undefined as unknown as any;

  readonly id: number = Component.GlobalComponentId;

  constructor() {
    Component.GlobalComponentId += 1;
  }

  create(data: T): ComponentData<T> {
    return {
      component: this,
      data,
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
