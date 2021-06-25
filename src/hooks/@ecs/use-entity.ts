import { useState } from 'react';
import { AnyComponentData } from '../../@ecs/component';
import { Entity } from '../../@ecs/entity';
import { World } from '../../@ecs/world';

export function useEntity<DataArray extends ReadonlyArray<AnyComponentData>>(
  world: World,
  dataArray: DataArray
): Entity<DataArray> {
  const [entity] = useState(() => world.createEntity(dataArray));

  return entity;
}
