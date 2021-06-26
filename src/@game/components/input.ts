import { boolean, component } from '../../@ecs/component';

export const Input = component({
  moveUp: boolean(),
  moveLeft: boolean(),
  moveDown: boolean(),
  moveRight: boolean(),
});
