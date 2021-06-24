import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import logo from './logo.svg';
import './App.css';
import { World } from './@ecs/world';
import { component, number } from './@ecs/component';
import { system } from './@ecs/system';
import { Dispatcher } from './@ecs/dispatcher';
import { Entity } from './@ecs/entity';

const Position = component({
  x: number(),
  y: number(),
});

const Velocity = component({
  x: number(),
  y: number(),
});

const MovementSystem = system([Position, Velocity], (position, velocity) => {
  const vmin = Math.min(window.innerWidth, window.innerHeight);
  position.x = Math.max(0, Math.min(vmin - 16 * 3, position.x + velocity.x));
  position.y = Math.max(0, Math.min(vmin - 16 * 3, position.y + velocity.y));
});

const AirResistenceSystem = system([Velocity], (velocity) => {
  velocity.x = Math.max(0, Math.abs(velocity.x) - 4) * Math.sign(velocity.x);
  velocity.y = Math.max(0, Math.abs(velocity.y) - 4) * Math.sign(velocity.y);
});

const GravitySystem = system([Position, Velocity], (position, velocity) => {
  const vmin = Math.min(window.innerWidth, window.innerHeight);
  velocity.x += 2 * Math.atan((vmin / 2 - (position.x + (16 * 3) / 2)) / 4);
  velocity.y += 2 * Math.atan((vmin / 2 - (position.y + (16 * 3) / 2)) / 4);
});

function App() {
  const [world, setWorld] = useState<World | null>(null);
  const [dispatcher, setDispatcher] = useState<Dispatcher | null>(null);
  const [player, setPlayer] = useState<Entity<
    readonly [typeof Position.Data, typeof Velocity.Data]
  > | null>(null);
  const [_, forceRerender] = useState(0);
  const keypress = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

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
      if (!velocity) {
        return;
      }
      velocity.x = velocity.x + x;
      velocity.y = velocity.y + y;
    },
    [player]
  );

  const processMove = useCallback(() => {
    if (keypress.current.w) {
      move(0, -6);
    }
    if (keypress.current.a) {
      move(-6, 0);
    }
    if (keypress.current.s) {
      move(0, 6);
    }
    if (keypress.current.d) {
      move(6, 0);
    }
  }, [keypress.current, move]);

  const handleKeyDownEvent = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'w':
        keypress.current.w = true;
        break;
      case 'a':
        keypress.current.a = true;
        break;
      case 's':
        keypress.current.s = true;
        break;
      case 'd':
        keypress.current.d = true;
        break;
    }
  }, []);

  const handleKeyUpEvent = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'w':
        keypress.current.w = false;
        break;
      case 'a':
        keypress.current.a = false;
        break;
      case 's':
        keypress.current.s = false;
        break;
      case 'd':
        keypress.current.d = false;
        break;
    }
  }, []);

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
      onKeyDown={handleKeyDownEvent}
      onKeyUp={handleKeyUpEvent}
    >
      <div
        className="me"
        style={{
          left: player?.componentDatas[0].data.x,
          top: player?.componentDatas[0].data.y,
        }}
      ></div>
    </div>
  );
}

export default App;
