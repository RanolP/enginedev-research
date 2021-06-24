export type ObjectSchema = {
  [key: string]: AbstractComponent<unknown>;
};

export type InferObjectSchema<T extends ObjectSchema> = {
  [K in keyof T]: InferSchema<T[K]>;
};

export type InferSchemaArray<T> = {
  [K in keyof T]: K extends number ? InferSchema<T[K]> : never;
};
export type InferSchema<T> = T extends AbstractComponent<infer U> ? U : never;

let GlobalComponentId = 0;

export interface ComponentData<T> {
  component: AbstractComponent<T>;
  data: T;
}

export abstract class AbstractComponent<T> {
  // just for the type
  readonly Data: ComponentData<T> = undefined as unknown as any;

  readonly id: number = GlobalComponentId;

  constructor() {
    GlobalComponentId += 1;
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

class NumberComponent extends AbstractComponent<number> {
  static INSTANCE: NumberComponent = new NumberComponent();

  private constructor() {
    super();
  }

  validate(data: unknown): number {
    if (typeof data === 'number') {
      return data;
    } else {
      throw new Error(`Expected Number but ${data} received.`);
    }
  }
}

class StringComponent extends AbstractComponent<string> {
  static INSTANCE: StringComponent = new StringComponent();

  private constructor() {
    super();
  }
  validate(data: unknown): string {
    if (typeof data === 'string') {
      return data;
    } else {
      throw new Error(`Expected String but ${data} received.`);
    }
  }
}

class BooleanComponent extends AbstractComponent<boolean> {
  static INSTANCE: BooleanComponent = new BooleanComponent();

  private constructor() {
    super();
  }

  validate(data: unknown): boolean {
    if (typeof data === 'boolean') {
      return data;
    } else {
      throw new Error(`Expected Boolean but ${data} received.`);
    }
  }
}

class ArrayComponent<T> extends AbstractComponent<Array<T>> {
  constructor(private readonly component: AbstractComponent<T>) {
    super();
  }

  validate(data: unknown): Array<T> {
    if (Array.isArray(data)) {
      return data.map((element) => this.component.validate(element));
    } else {
      throw new Error(`Expected Array but ${data} received.`);
    }
  }
}

class ObjectComponent<T extends ObjectSchema> extends AbstractComponent<
  InferObjectSchema<T>
> {
  constructor(private readonly schema: T) {
    super();
  }

  validate(data: unknown): InferObjectSchema<T> {
    if (typeof data !== 'object' || !data) {
      throw new Error(`Expected Array but ${data} received.`);
    }

    const result = {} as InferObjectSchema<T>;
    const validators = { ...this.schema };
    for (const key of Object.keys(data)) {
      if (key in validators) {
        result[key as keyof T] = validators[key].validate(
          (data as Record<string, unknown>)[key]
        ) as unknown as any;
        delete validators[key];
      } else {
        throw new Error(`Unexpected key ${key}`);
      }
    }

    const unaccepted = Object.keys(validators);
    if (unaccepted.length > 0) {
      throw new Error(
        `Expected ${unaccepted.join(', ')}, but neither accepted.`
      );
    }

    return result;
  }
}

export function component<Schema extends ObjectSchema>(
  schema: Schema
): AbstractComponent<InferObjectSchema<Schema>> {
  return new ObjectComponent(schema);
}

export function string(): AbstractComponent<string> {
  return StringComponent.INSTANCE;
}

export function number(): AbstractComponent<number> {
  return NumberComponent.INSTANCE;
}

export function boolean(): AbstractComponent<boolean> {
  return BooleanComponent.INSTANCE;
}

export function array<T>(component: AbstractComponent<T>): ArrayComponent<T> {
  return new ArrayComponent(component);
}
