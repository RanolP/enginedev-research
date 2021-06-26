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
import { useEventLoop } from './hooks/use-event-loop';
import { InputControlSystem } from './@game/systems/input-control';
import { Input } from './@game/components/input';

function App() {
  const world = useWorld([Input, Position, Velocity], (world) => {
    const snapshot = localStorage.getItem('world');
    if (snapshot) {
      return snapshot;
    }

    world.createEntity([
      Input.create(),
      Position.create({ x: 0, y: 0 }),
      Velocity.create({ x: 0, y: 0 }),
    ]);

    return null;
  });
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

  Input.injectGlobal(() => keypress.current);

  useEventLoop(
    60,
    () => {
      dispatcher.dispatch();
      localStorage.setItem('world', world.createSnapshot());
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
      {Object.values(world.entities).map((entity) => {
        const position = world.getEntityData(entity, Position);
        if (!position) return null;

        return (
          <div
            className="me"
            key={entity.id}
            style={{
              left: position.x,
              top: position.y,
            }}
          ></div>
        );
      })}
      <div className="ground"> </div>
    </div>
  );
}

export default App;
