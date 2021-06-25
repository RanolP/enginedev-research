import { KeyboardEvent, MutableRefObject, useCallback, useRef } from 'react';

export type KeyboardInputSchema = Record<string, string>;
export type KeyboardInputState<T extends KeyboardInputSchema> = {
  [K in T[keyof T]]: boolean;
};

type Test = KeyboardInputState<{
  w: 'moveTop';
}>;

export interface KeyboardInput<Schema extends KeyboardInputSchema> {
  keypress: MutableRefObject<KeyboardInputState<Schema>>;
  handleKeyDown(event: KeyboardEvent): void;
  handleKeyUp(event: KeyboardEvent): void;
}

export function useKeyboardInput<Schema extends KeyboardInputSchema>(
  schema: Schema
): KeyboardInput<Schema> {
  const keypress = useRef(
    Object.fromEntries(
      Object.values(schema).map((key) => [key, false])
    ) as KeyboardInputState<Schema>
  );

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    const name = schema[e.key];
    if (name) {
      keypress.current[name as keyof KeyboardInputState<Schema>] = true;
    }
  }, []);

  const handleKeyup = useCallback((e: KeyboardEvent) => {
    const name = schema[e.key];
    if (name) {
      keypress.current[name as keyof KeyboardInputState<Schema>] = false;
    }
  }, []);

  return {
    keypress,
    handleKeyDown: handleKeydown,
    handleKeyUp: handleKeyup,
  };
}
