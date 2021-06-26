import { system } from '../../@ecs/system';
import { Velocity } from '../components/velocity';

function stepToZero(value: number, step: number) {
  // Step to opposite direction
  const result = value + -Math.sign(value) * step;
  // sign differs = over zero
  if (Math.sign(value) != Math.sign(result)) {
    return 0;
  } else {
    return result;
  }
}

export const AirResistenceSystem = system([Velocity] as const, (velocity) => {
  velocity.x = stepToZero(velocity.x, 4);
  velocity.y = stepToZero(velocity.y, 4);
});
