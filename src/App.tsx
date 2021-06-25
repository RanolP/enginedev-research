import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { World } from './@ecs/world';
import { Dispatcher } from './@ecs/dispatcher';
import { Entity } from './@ecs/entity';
import { useKeyboardInput } from './hooks/use-keyboard-input';
import { Position } from './@game/components/position';
import { Velocity } from './@game/components/velocity';
import { MovementSystem } from './@game/systems/movement';
import { AirResistenceSystem } from './@game/systems/air-resistence';
import { GravitySystem } from './@game/systems/gravity';

function App() {
  const [world, setWorld] = useState<World | null>(null);
  const [dispatcher, setDispatcher] = useState<Dispatcher | null>(null);
  const [player, setPlayer] = useState<Entity<
    readonly [typeof Position.Data, typeof Velocity.Data]
  > | null>(null);
  const [_, forceRerender] = useState(0);
  const { keypress, handleKeyDown, handleKeyUp } = useKeyboardInput({
    w: 'moveUp',
    a: 'moveLeft',
    s: 'moveDown',
    d: 'moveRight',
  } as const);

  useEffect(() => {
    const world = new World();
    setWorld(world);

    const player = world.createEntity([
      Position.create({ x: 0, y: 0 }),
      Velocity.create({ x: 0, y: 0 }),
    ] as const);
    setPlayer(player);

    const dispatcher = new Dispatcher([
      MovementSystem,
      AirResistenceSystem,
      GravitySystem,
    ]);

    dispatcher.setup(world);

    setDispatcher(dispatcher);
  }, []);

  const move = useCallback(
    (x: number, y: number) => {
      const velocity = player?.getDataFor(Velocity);
      if (!velocity) return;

      velocity.x += x;
      velocity.y += y;
    },
    [player]
  );

  const processMove = useCallback(() => {
    if (keypress.current.moveUp) move(0, -6);
    if (keypress.current.moveLeft) move(-6, 0);
    if (keypress.current.moveDown) move(0, 6);
    if (keypress.current.moveRight) move(6, 0);
  }, [keypress.current, move]);

  useEffect(() => {
    const scheduler = setInterval(() => {
      if (world === null || dispatcher === null) {
        return;
      }
      processMove();
      dispatcher.dispatch(world);
      forceRerender((i) => i + 1);
    }, 1000 / 60);

    return () => clearInterval(scheduler);
  }, [world, dispatcher]);

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
