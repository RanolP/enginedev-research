import { AbstractComponent } from './component';
import { System } from './system';
import { World } from './world';

export class Dispatcher {
  constructor(
    private readonly systems: Array<System<AbstractComponent<unknown>[]>>
  ) {}

  setup(world: World) {
    for (const system of this.systems) {
      system.setup(world);
    }
  }

  dispatch(world: World) {
    for (const system of this.systems) {
      system.runNow(world);
    }
  }
}
