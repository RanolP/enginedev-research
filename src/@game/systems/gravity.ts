import { system } from '../../@ecs/system';
import { mapSize, playerSize } from '../../constants';
import { Position } from '../components/position';
import { Velocity } from '../components/velocity';

export const GravitySystem = system(
  [Position, Velocity] as const,
  (position, velocity) => {
    const center = mapSize() / 2 - playerSize() / 2;
    velocity.x += 2 * Math.atan((center - position.x) / 4);
    velocity.y += 2 * Math.atan((center - position.y) / 4);
  }
);
