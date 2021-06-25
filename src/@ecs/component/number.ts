import { Component } from './base';

export class NumberComponent extends Component<number> {
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

export function number(): Component<number> {
  return NumberComponent.INSTANCE;
}
