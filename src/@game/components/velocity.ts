import { component, number } from '../../@ecs/component';

export const Velocity = component('Velocity', {
  x: number(),
  y: number(),
});
