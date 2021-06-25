import { AnyComponentData } from './component';
import { createEntity, Entity, EntityId } from './entity';

export class World {
  public resources: Record<EntityId, Entity<readonly AnyComponentData[]>> = {};

  createEntity<ComponentDataArray extends ReadonlyArray<AnyComponentData>>(
    componentDataArray: ComponentDataArray
  ): Entity<ComponentDataArray> {
    const entity = createEntity(componentDataArray);
    this.resources[entity.id] = entity;
    return entity;
  }
}
