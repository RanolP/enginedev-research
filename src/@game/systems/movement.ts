import { system } from '../../@ecs/system';
import { mapSize, playerSize } from '../../constants';
import { Position } from '../components/position';
import { Velocity } from '../components/velocity';

function coerceIn(value: number, min: number, max: number) {
  if (value < min) {
    return min;
  }
  if (max < value) {
    return max;
  }
  return value;
}

export const MovementSystem = system(
  [Position, Velocity],
  (position, velocity) => {
    position.x = coerceIn(position.x + velocity.x, 0, mapSize() - playerSize());
    position.y = coerceIn(position.y + velocity.y, 0, mapSize() - playerSize());
  }
);
