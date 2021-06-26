import { system } from '../../@ecs/system';
import { mapSize, playerSize } from '../../constants';
import { Position } from '../components/position';
import { Velocity } from '../components/velocity';

export const GravitySystem = system(
  [Position, Velocity] as const,
  (position, velocity) => {
    velocity.y +=
      4 * Math.atan((mapSize() - playerSize() - 20 * 16 - position.y) / 4);
  }
);
