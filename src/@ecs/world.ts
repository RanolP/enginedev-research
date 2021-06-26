import {
  AnyComponent,
  AnyComponentData,
  Component,
  InferSchema,
} from './component';
import { Entity, EntityId } from './entity';

export type WorldSnapshot = string;

export class World {
  private lastEntityId: number = 0;

  public entities: Record<EntityId, Entity> = {};
  public components: Record<string, Record<EntityId, unknown>> = {};
  public componentsRegistered: Record<string, AnyComponent> = {};

  constructor(components: AnyComponent[]) {
    for (const component of components) {
      this.componentsRegistered[component.id] = component;
    }
  }

  createEntity<DataArray extends ReadonlyArray<AnyComponentData>>(
    dataArray: DataArray
  ): Entity {
    const entity = new Entity(this.lastEntityId.toString());
    this.lastEntityId += 1;

    for (const data of dataArray) {
      if (!(data.component.id in this.components)) {
        this.components[data.component.id] = {};
      }
      this.components[data.component.id][entity.id] = data.data;
    }
    this.entities[entity.id] = entity;
    return entity;
  }

  getEntityData<C extends AnyComponent>(
    entity: Entity,
    component: C
  ): InferSchema<C> | undefined {
    return this.components[component.id]?.[
      entity.id
    ] as unknown as InferSchema<C>;
  }

  loadSnapshot(snapshot: WorldSnapshot) {
    const parsed = JSON.parse(snapshot);
    this.lastEntityId = parsed.lastEntityId as number;
    this.entities = Object.fromEntries(
      (parsed.entities as EntityId[]).map((id) => [id, new Entity(id)])
    );
    console.log(parsed.components);
    this.components = Object.fromEntries(
      Object.entries(parsed.components).map(([key, value]) => [
        key,
        Object.fromEntries(
          Object.entries(value as object).map(([entity, value]) => [
            entity,
            this.componentsRegistered[key].deserialize(String(value)),
          ])
        ),
      ])
    );
  }

  createSnapshot(): WorldSnapshot {
    return JSON.stringify({
      lastEntityId: this.lastEntityId,
      entities: Object.keys(this.entities),
      components: Object.fromEntries(
        Object.entries(this.components).map(([key, components]) => [
          key,
          Object.fromEntries(
            Object.entries(components).map(([entity, data]) => [
              entity,
              this.componentsRegistered[key].serialize(data),
            ])
          ),
        ])
      ),
    });
  }
}
