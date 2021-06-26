import { Component } from './base';

class ArrayComponent<T> extends Component<Array<T>> {
  constructor(private readonly component: Component<T>) {
    super(`${component.id}[]`);
  }

  validate(data: unknown): Array<T> {
    if (Array.isArray(data)) {
      return data.map((element) => this.component.validate(element));
    } else {
      throw new Error(`Expected Array but ${data} received.`);
    }
  }
}

export function array<T>(component: Component<T>): ArrayComponent<T> {
  return new ArrayComponent(component);
}
