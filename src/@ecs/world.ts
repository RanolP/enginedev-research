import { AnyComponentData } from './component';
import { createEntity, Entity, EntityId } from './entity';

export class World {
  public resources: Record<EntityId, Entity<readonly AnyComponentData[]>> = {};

  createEntity<DataArray extends ReadonlyArray<AnyComponentData>>(
    dataArray: DataArray
  ): Entity<DataArray> {
    const entity = createEntity(dataArray);
    this.resources[entity.id] = entity;
    return entity;
  }
}
