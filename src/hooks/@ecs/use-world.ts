import { useEffect, useState } from 'react';
import { AnyComponent } from '../../@ecs/component';
import { World, WorldSnapshot } from '../../@ecs/world';

export function useWorld(
  components: AnyComponent[],
  init?: (world: World) => WorldSnapshot | null
): World {
  const [world] = useState(new World(components));

  useEffect(() => {
    const snapshot = init?.(world);
    if (snapshot) {
      world.loadSnapshot(snapshot);
    }
  }, []);

  return world;
}
