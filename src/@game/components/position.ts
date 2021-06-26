import { component, number } from '../../@ecs/component';

export const Position = component('Position', {
  x: number(),
  y: number(),
});
