import { Component, InferSchema } from './base';

export type ObjectSchema = {
  [key: string]: Component<unknown>;
};

export type InferObjectSchema<T extends ObjectSchema> = {
  [K in keyof T]: InferSchema<T[K]>;
};

class ObjectComponent<T extends ObjectSchema> extends Component<
  InferObjectSchema<T>
> {
  constructor(name: string, private readonly schema: T) {
    super(name);
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

export function object<Schema extends ObjectSchema>(
  name: string,
  schema: Schema
): Component<InferObjectSchema<Schema>> {
  return new ObjectComponent(name, schema);
}
