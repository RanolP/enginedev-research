import { AnyComponent, InferSchemaArray } from './component';
import { World } from './world';

export type AnySystem = System<readonly AnyComponent[]>;

export abstract class System<ComponentArray extends readonly AnyComponent[]> {
  constructor(readonly componentArray: ComponentArray) {}
  abstract setup(world: World): void;
  abstract run(data: InferSchemaArray<ComponentArray>): void;
  abstract dispose(world: World): void;

  runNow(world: World): void {
    for (const entity of Object.values(world.entities)) {
      const datas = this.componentArray.map((component) =>
        world.getEntityData(entity, component)
      );
      if (datas.every((data) => data)) {
        this.run(datas as unknown as InferSchemaArray<ComponentArray>);
      }
    }
  }
}

export function system<ComponentArray extends readonly AnyComponent[]>(
  componentArray: ComponentArray,
  run: (...data: InferSchemaArray<ComponentArray>) => void
): System<ComponentArray> {
  return new (class extends System<ComponentArray> {
    constructor() {
      super(componentArray);
    }
    setup() {}
    run(data: InferSchemaArray<ComponentArray>) {
      run(...data);
    }
    dispose() {}
  })();
}
