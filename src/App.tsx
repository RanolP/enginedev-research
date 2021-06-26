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
import { InputControlSystem } from './@game/systems/input-control';
import { Input } from './@game/components/input';

function App() {
  const world = useWorld();
  const dispatcher = useDispatcher(world, [
    MovementSystem,
    AirResistenceSystem,
    GravitySystem,
    InputControlSystem,
  ]);
  const { keypress, handleKeyDown, handleKeyUp } = useKeyboardInput({
    w: 'moveUp',
    a: 'moveLeft',
    s: 'moveDown',
    d: 'moveRight',
  } as const);
  const player = useEntity(world, [
    Position.create({ x: 0, y: 0 }),
    Velocity.create({ x: 0, y: 0 }),
    Input.createRef(keypress),
  ] as const);

  useEventLoop(
    60,
    () => {
      dispatcher.dispatch();
    },
    [dispatcher]
  );

  const position = world.getEntityData(player, Position);

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
          left: position?.x,
          top: position?.y,
        }}
      ></div>
    </div>
  );
}

export default App;
