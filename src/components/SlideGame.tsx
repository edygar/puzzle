import {
  onMount,
  createMemo,
  onCleanup,
  Show,
  createEffect,
  For,
  untrack,
} from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import { createStore } from "solid-js/store";
import { Button } from "./Button";
import { Title } from "./Title";
import { HStack, VStack } from "./VStack";
import confetti from "canvas-confetti";
import TinyQueue from "tinyqueue";

const swap = <T,>(tiles: Array<T>, a: number, b: number) => {
  [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
  return tiles;
};

const possibleMoves = (index: number, cols: number) => {
  const [x, y] = coordinates(index, cols);
  const moves = [];
  if (x > 0) moves.push(index - 1);
  if (y > 0) moves.push(index - cols);
  if (x < cols - 1) moves.push(index + 1);
  if (y < cols - 1) moves.push(index + cols);
  return moves;
};
const hash = (tiles: number[]) => tiles.join(",");
const misplaced = (tiles: number[]) =>
  tiles.reduce((acc, tile, index) => {
    if (tile === index) {
      return acc;
    }
    return acc + 1;
  }, 0);

interface TileNode {
  tiles: number[];
  cost: number; // This is 'f' = 'g' + 'h' where 'g' is the path cost and 'h' is the heuristic cost
  emptySlot: number;
  prev?: TileNode;
}

const solve = (initialTiles: number[], cols: number): number[] | null => {
  const pq = new TinyQueue<TileNode>([], (a, b) => a.cost - b.cost);
  const visited = new Set<string>();
  const empty = cols * cols - 1;
  const startNode: TileNode = {
    tiles: initialTiles,
    cost: misplaced(initialTiles), // Assuming 'misplaced' is your heuristic (h). You might need to adjust this.
    emptySlot: initialTiles.indexOf(empty),
  };

  pq.push(startNode);

  while (pq.length) {
    const current = pq.pop()!;
    const currentHash = hash(current.tiles);

    if (misplaced(current.tiles) === 0) {
      return reconstructPath(current);
    }

    visited.add(currentHash);

    for (const move of possibleMoves(current.emptySlot, cols)) {
      const newTiles = swap(current.tiles.slice(), current.emptySlot, move);
      const newHash = hash(newTiles);

      if (visited.has(newHash)) {
        continue;
      }

      const g = current.tiles.length - misplaced(current.tiles);
      const h = misplaced(newTiles);
      const f = g + h;

      pq.push({
        tiles: newTiles,
        cost: f,
        emptySlot: move,
        prev: current,
      });
    }
  }

  return null;
};

const reconstructPath = (node: TileNode): number[] => {
  let current = node;
  const path = [];
  while (current.prev) {
    path.unshift(current.emptySlot); // This might need to be adjusted based on how you want to record the path
    current = current.prev;
  }
  return path;
};

const coordinates = (index: number, cols: number) => [
  index % cols,
  Math.floor(index / cols),
];

export const SlideGame = (props: {
  tiles?: number;
  image: string;
  onReset: VoidFunction;
}) => {
  const board = createMemo(() => {
    const tiles = props.tiles || 9;
    const rows = Math.sqrt(tiles);
    const cols = rows;
    return { rows, cols, tiles };
  });

  const [gameState, updateGame] = createStore<{
    tiles: number[];
    containerSide: number;
    start: Date;
    current: Date;
    emptySlot: number;
    solving: boolean;
    solutionLength: number | null;
  }>({
    tiles: [],
    containerSide: 0,
    start: new Date(),
    current: new Date(),
    emptySlot: 0,
    solving: false,
    solutionLength: null,
  });

  createEffect(() => {
    let tiles: number[];

    do {
      tiles = Array.from(
        { length: board().rows * board().cols },
        (_, index) => index,
      ).sort(() => Math.random() - 0.5);
    } while (misplaced(tiles) < 2 || !solve(tiles, board().cols));
    updateGame("tiles", tiles);
    updateGame("emptySlot", tiles.length - 1);
  });

  const timer = setInterval(() => updateGame("current", new Date()), 1000);
  onCleanup(() => clearInterval(timer));
  createEffect(() => {
    if (won()) {
      clearInterval(timer);
    }
  });

  let container: HTMLDivElement;
  let img: HTMLImageElement | null = null;

  const won = createMemo(() => misplaced(gameState.tiles) === 0);

  const sizes = createMemo(() => {
    const { naturalWidth, naturalHeight } = img || {
      naturalWidth: 0,
      naturalHeight: 0,
    };
    const containerLength = gameState.containerSide;
    let ratio, bgHeight, bgWidth;

    if (naturalWidth > naturalHeight) {
      ratio = naturalWidth / naturalHeight;
      bgHeight = containerLength;
      bgWidth = containerLength * ratio;
    } else {
      ratio = naturalHeight / naturalWidth;
      bgWidth = containerLength;
      bgHeight = containerLength * ratio;
    }

    return {
      bgWidth,
      bgHeight,
      offsetX: (bgWidth - containerLength) / 2,
      offsetY: (bgHeight - containerLength) / 2,
    };
  });

  let debounce: ReturnType<typeof setTimeout>;
  const updateSide = () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const { width, height } =
        container.parentElement!.getBoundingClientRect();
      updateGame("containerSide", Math.min(width, height));
      Promise.resolve().then(
        () => container?.classList.add("animate-[animate-pop_1s]"),
      );
    }, 100);
  };

  onMount(() => {
    window.addEventListener("resize", updateSide);
    screen.orientation.addEventListener("change", updateSide);

    onCleanup(() => {
      screen.orientation.removeEventListener("change", updateSide);
      window.removeEventListener("resize", updateSide);
    });
  });

  function getTileStyle(currentPlacement: number) {
    const [slotX, slotY] = coordinates(currentPlacement, board().cols);
    const { bgWidth, bgHeight, offsetX, offsetY } = sizes();

    return {
      "background-image": "var(--bg)",
      "background-size": `${bgWidth}px ${bgHeight}px`,
      "background-position": `left ${
        slotX * -(gameState.containerSide / board().cols) - offsetX
      }px top ${
        slotY * -Math.floor(gameState.containerSide / board().rows) - offsetY
      }px`,
      "-webkit-tap-highlight-color": "transparent",
    };
  }

  function move(index: number) {
    const emptySlotIndex = gameState.tiles.indexOf(gameState.emptySlot);
    const [targetX, targetY] = coordinates(emptySlotIndex, board().cols);
    const [originX, originY] = coordinates(index, board().cols);

    switch (true) {
      case targetX === originX:
        if (Math.abs(targetY - originY) !== 1) {
          return;
        }
        break;
      case targetY === originY:
        if (Math.abs(targetX - originX) !== 1) {
          return;
        }
        break;
      default:
        return true;
    }

    updateGame("tiles", swap(gameState.tiles.slice(0), emptySlotIndex, index));
  }

  let interval: ReturnType<typeof setInterval>;
  createEffect(() => {
    if (!gameState.solving) {
      clearInterval(interval);
      return;
    }
    untrack(() => {
      const solution = solve(gameState.tiles, board().cols)!;

      updateGame("solutionLength", solution.length);
      clearInterval(interval);
      interval = setInterval(
        () => {
          if (solution.length) {
            move(solution.shift()!);
          }

          updateGame("solutionLength", solution.length);
          if (won()) {
            clearInterval(interval);
          }
        },
        Math.min(
          1000,
          3000 / gameState.tiles.reduce((a, b) => a + Math.abs(b % 4), 0),
        ),
      );
    });
  });

  let animationFrame: number;
  let confettiTimeout: ReturnType<typeof setTimeout>;
  createEffect(() => {
    if (!won()) return;

    const end = Date.now() + 1_000;
    function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        animationFrame = requestAnimationFrame(frame);
      }
    }
    confettiTimeout = setTimeout(frame, 500);
  });

  onCleanup(() => {
    cancelAnimationFrame(animationFrame);
    confetti.reset();
    clearInterval(interval);
    clearTimeout(confettiTimeout);
  });

  const formatter = new Intl.DateTimeFormat("en", {
    minute: "numeric",
    second: "numeric",
  });

  return (
    <VStack class="flex-1">
      <img
        ref={(el) => {
          img = el;
        }}
        src={props.image}
        hidden
        onLoad={updateSide}
      />
      <Show
        when={img}
        fallback={
          <div class="grid h-full place-content-center">Loading...</div>
        }
      >
        <HStack gap={5} class="m-3" items="center" justify="center">
          <Button onClick={props.onReset}>&#8592; Back</Button>
          <Title level={3}>
            {formatter.format(
              new Date(gameState.current.getTime() - gameState.start.getTime()),
            )}
          </Title>

          <Button
            onClick={() => updateGame("solving", (isSolving) => !isSolving)}
          >
            {gameState.solving
              ? `Solving... (${gameState.solutionLength} movements to go)`
              : "Solve"}
          </Button>
        </HStack>
        <div class="flex flex-1 flex-col items-center justify-center overflow-hidden">
          <div
            ref={(el) => {
              container = el;
            }}
            class="grid aspect-square items-center justify-center overflow-hidden transition-[height]"
            style={{
              height: `${gameState.containerSide}px`,
              "--bg": `url(${props.image})`,
              "grid-template-columns": `repeat(${
                board().cols
              }, minmax(0, 1fr))`,
            }}
          >
            <TransitionGroup name="slide">
              <For each={gameState.tiles}>
                {(tile, index) => (
                  <button
                    disabled={!!won()}
                    type="button"
                    class="box-content aspect-square appearance-none border bg-no-repeat transition-[transform,shadow] duration-300"
                    classList={{
                      "border-transparent": won(),
                      "shadow-xl": !won(),
                      "opacity-0": tile === gameState.emptySlot,
                    }}
                    style={getTileStyle(tile)}
                    {...{
                      ["ontouchstart" in window ? "onTouchStart" : "onClick"]: (
                        e: PointerEvent,
                      ) => {
                        e.preventDefault();
                        move(index());
                      },
                    }}
                  />
                )}
              </For>
            </TransitionGroup>
          </div>
        </div>
      </Show>
      <Show when={won()}>
        <div
          class="absolute inset-0 grid h-full w-full animate-[1s_fade-in_500ms] place-content-center font-bold opacity-0 backdrop-blur-lg"
          style={{ "animation-fill-mode": "forwards" }}
        >
          <div>
            <img
              class="m-auto w-1/2 animate-[1s_animate-pop_500ms] shadow-xl"
              src={props.image}
            />
            <Title level={2}>You Won!</Title>
            <Title level={4}>
              {`Time ellapsed: ${formatter.format(
                new Date(
                  gameState.current.getTime() - gameState.start.getTime(),
                ),
              )}`}
            </Title>

            <Button
              class="m-auto block text-xl font-normal"
              onClick={() => props.onReset()}
            >
              Play Again
            </Button>
          </div>
        </div>
      </Show>
    </VStack>
  );
};
