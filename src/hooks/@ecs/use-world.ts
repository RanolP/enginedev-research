import { useState } from 'react';
import { World } from '../../@ecs/world';

export function useWorld(): World {
  const [world] = useState(new World());

  return world;
}
