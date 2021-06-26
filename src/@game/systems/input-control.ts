import { system } from '../../@ecs/system';
import { mapSize, playerSize } from '../../constants';
import { Input } from '../components/input';
import { Position } from '../components/position';
import { Velocity } from '../components/velocity';

export const InputControlSystem = system(
  [Input, Position, Velocity] as const,
  (input, position, velocity) => {
    if (input.moveUp && mapSize() - playerSize() - 20 * 16 - position.y < 1)
      velocity.y = -40;
    if (input.moveLeft) velocity.x = -20;
    if (input.moveRight) velocity.x = 20;
  }
);
