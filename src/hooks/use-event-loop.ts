import { DependencyList, useEffect } from 'react';

export function useEventLoop(
  framePerSecond: number,
  f: () => void,
  dependencyList: DependencyList
) {
  useEffect(() => {
    const id = setInterval(() => {
      f();
    }, 1000 / framePerSecond);

    return () => clearInterval(id);
  }, dependencyList);
}
