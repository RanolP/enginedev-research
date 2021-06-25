import React, { useCallback } from 'react';
import './App.css';
import { useKeyboardInput } from './hooks/use-keyboard-input';
import { Position } from './@game/components/position';
import { Velocity } from './@game/components/velocity';
import { MovementSystem } from './@game/systems/movement';
import { AirResistenceSystem } from './@game/systems/air-resistence';
import { GravitySystem } from './@game/systems/gravity';
import { useWorld } from './hooks/@ecs/use-world';
import { useDispatcher } from './hooks/@ecs/use-dispatcher';
import { useEntity } from './hooks/@ecs/use-entity';
import { useEventLoop } from './hooks/use-event-loop';

function App() {
  const world = useWorld();
  const dispatcher = useDispatcher(world, [
    MovementSystem,
    AirResistenceSystem,
    GravitySystem,
  ]);
  const player = useEntity(world, [
    Position.create({ x: 0, y: 0 }),
    Velocity.create({ x: 0, y: 0 }),
  ] as const);
  const { keypress, handleKeyDown, handleKeyUp } = useKeyboardInput({
    w: 'moveUp',
    a: 'moveLeft',
    s: 'moveDown',
    d: 'moveRight',
  } as const);

  const move = useCallback(
    (x: number, y: number) => {
      player?.mutate(Velocity, (velocity) => {
        velocity.x += x;
        velocity.y += y;
      });
    },
    [player]
  );

  const processMove = useCallback(() => {
    if (keypress.current.moveUp) move(0, -6);
    if (keypress.current.moveLeft) move(-6, 0);
    if (keypress.current.moveDown) move(0, 6);
    if (keypress.current.moveRight) move(6, 0);
  }, [keypress.current, move]);

  useEventLoop(
    60,
    () => {
      processMove();
      dispatcher.dispatch();
    },
    [dispatcher]
  );

  return (
    <div
      className="App"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <div
        className="me"
        style={{
          left: player?.getDataFor(Position)?.x,
          top: player?.getDataFor(Position)?.y,
        }}
      ></div>
    </div>
  );
}

export default App;
