import { AnyComponentData, Component } from './component';

let GlobalId = 0;

export type EntityId = number;

export class Entity<DataArray extends readonly AnyComponentData[]> {
  constructor(readonly id: EntityId, readonly dataArray: DataArray) {}

  getDataFor<T>(component: Component<T>): T | undefined {
    return this.dataArray.find((data) => data.component.id === component.id)
      ?.data as T;
  }

  mutate<T>(component: Component<T>, modification: (data: T) => void) {
    const data = this.getDataFor(component);
    if (data) {
      modification(data);
    }
  }
}

export function createEntity<DataArray extends readonly AnyComponentData[]>(
  dataArray: DataArray
): Entity<DataArray> {
  const id = GlobalId;
  GlobalId += 1;
  return new Entity(id, dataArray);
}
