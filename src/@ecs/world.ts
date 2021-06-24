import { ComponentData } from './component';
import { createEntity, Entity, EntityId } from './entity';

export class World {
  public resources: Record<
    EntityId,
    Entity<readonly ComponentData<unknown>[]>
  > = {};

  createEntity<ComponentDatas extends ReadonlyArray<ComponentData<unknown>>>(
    componentDatas: ComponentDatas
  ): Entity<ComponentDatas> {
    const entity = createEntity(componentDatas);
    this.resources[entity.id] = entity;
    return entity;
  }
}
