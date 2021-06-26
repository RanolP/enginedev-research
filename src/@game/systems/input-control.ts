import { system } from '../../@ecs/system';
import { Input } from '../components/input';
import { Velocity } from '../components/velocity';

export const InputControlSystem = system(
  [Input, Velocity] as const,
  (input, velocity) => {
    if (input.moveUp) velocity.y -= 6;
    if (input.moveLeft) velocity.x -= 6;
    if (input.moveDown) velocity.y += 6;
    if (input.moveRight) velocity.x += 6;
  }
);
