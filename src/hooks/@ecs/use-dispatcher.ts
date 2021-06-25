import { useEffect, useState } from 'react';
import { Dispatcher } from '../../@ecs/dispatcher';
import { AnySystem } from '../../@ecs/system';
import { World } from '../../@ecs/world';

export interface DispatcherHook {
  dispatch(): void;
}

export function useDispatcher(
  world: World,
  systems: AnySystem[]
): DispatcherHook {
  const [dispatcher] = useState(new Dispatcher(systems));
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    dispatcher.setup(world);
  }, [dispatcher]);

  return {
    dispatch() {
      dispatcher.dispatch(world);
      forceUpdate((i) => i + 1);
    },
  };
}
