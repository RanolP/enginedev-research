import { Component, ComponentData } from './base';

export class InjectedComponent<Data> extends Component<Data> {
  constructor(name: string, private getter: () => Data) {
    super(name);
  }

  create(): ComponentData<Data> {
    const that = this;
    return {
      component: this,
      get data() {
        return that.getter();
      },
    };
  }

  injectGlobal(getter: () => Data) {
    this.getter = getter;
  }

  serialize(data: Data): string {
    return 'null';
  }

  validate(data: unknown): Data {
    return this.getter();
  }
}

export function injected<Data>(
  name: string,
  defaultValue: Data
): InjectedComponent<Data> {
  return new InjectedComponent(name, () => defaultValue);
}
