import { AbstractComponent, InferSchema, InferSchemaArray } from './component';
import { World } from './world';

export abstract class System<Data extends Array<AbstractComponent<unknown>>> {
  constructor(readonly data: Data) {}
  abstract setup(world: World): void;
  abstract run(data: InferSchemaArray<Data>): void;
  abstract dispose(world: World): void;

  runNow(world: World): void {
    for (const resource of Object.values(world.resources)) {
      const datas = this.data.map((component) =>
        resource.getDataFor(component)
      );
      if (datas.every((data) => data)) {
        this.run(datas as InferSchemaArray<Data>);
      }
    }
  }
}

export function system<Data extends Array<AbstractComponent<unknown>>>(
  data: Data,
  run: (...data: InferSchemaArray<Data>) => void
): System<Data> {
  return new (class extends System<Data> {
    constructor() {
      super(data);
    }
    setup() {}
    run(data: InferSchemaArray<Data>) {
      run(...data);
    }
    dispose() {}
  })();
}
