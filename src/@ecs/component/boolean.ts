import { Component } from './base';

export class BooleanComponent extends Component<boolean> {
  static INSTANCE: BooleanComponent = new BooleanComponent();

  private constructor() {
    super('Boolean');
  }

  validate(data: unknown): boolean {
    if (typeof data === 'boolean') {
      return data;
    } else {
      throw new Error(`Expected Boolean but ${data} received.`);
    }
  }
}

export function boolean(): Component<boolean> {
  return BooleanComponent.INSTANCE;
}
