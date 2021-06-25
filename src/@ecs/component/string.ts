import { Component } from './base';

export class StringComponent extends Component<string> {
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

export function string(): Component<string> {
  return StringComponent.INSTANCE;
}
