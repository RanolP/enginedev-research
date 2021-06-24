import { AbstractComponent, ComponentData } from './component';

let GlobalId = 0;

export type EntityId = number;

export class Entity<
  ComponentDatas extends ReadonlyArray<ComponentData<unknown>>
> {
  constructor(readonly id: EntityId, readonly componentDatas: ComponentDatas) {}

  getDataFor<T>(component: AbstractComponent<T>): T | undefined {
    return this.componentDatas.find(
      (data) => data.component.id === component.id
    )?.data as T;
  }
}

export function createEntity<
  ComponentDatas extends ReadonlyArray<ComponentData<unknown>>
>(componentDatas: ComponentDatas): Entity<ComponentDatas> {
  const id = GlobalId;
  GlobalId += 1;
  return new Entity(id, componentDatas);
}
