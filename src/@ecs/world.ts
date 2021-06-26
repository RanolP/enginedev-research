import {
  AnyComponent,
  AnyComponentData,
  Component,
  InferSchema,
} from './component';
import { Entity, EntityId } from './entity';

export class World {
  public entities: Record<string, Entity> = {};
  public components: Record<string, Record<string, AnyComponentData>> = {};

  createEntity<DataArray extends ReadonlyArray<AnyComponentData>>(
    dataArray: DataArray
  ): Entity {
    const entity = new Entity();
    for (const data of dataArray) {
      if (!(data.component.id in this.components)) {
        this.components[data.component.id as unknown as string] = {};
      }
      this.components[data.component.id as unknown as string][
        entity.id as unknown as string
      ] = data;
    }
    this.entities[entity.id as unknown as string] = entity;
    return entity;
  }

  getEntityData<C extends AnyComponent>(
    entity: Entity,
    component: C
  ): InferSchema<C> | undefined {
    return this.components[component.id as unknown as string]?.[
      entity.id as unknown as string
    ]?.data as unknown as InferSchema<C>;
  }
}
