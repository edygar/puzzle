import {
  onMount,
  createMemo,
  onCleanup,
  Show,
  Index,
  createEffect,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Button } from "./Button";
import { Title } from "./Title";
import { HStack, VStack } from "./VStack";
import confetti from "canvas-confetti";

export const Game = (props: {
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
  }>({
    tiles: [],
    containerSide: 0,
    start: new Date(),
    current: new Date(),
  });

  createEffect(() => {
    updateGame(
      "tiles",
      Array.from({ length: board().rows * board().cols }, () =>
        Math.floor(Math.random() * 4),
      ),
    );
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

  const won = createMemo(() =>
    gameState.tiles.every((rotations) => Math.abs(rotations) % 4 === 0),
  );

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

  function getQuadrantStyle(rotations: number, index: number) {
    const x = index % board().cols;
    const y = Math.floor(index / board().rows);
    const { bgWidth, bgHeight, offsetX, offsetY } = sizes();

    return {
      "background-image": "var(--bg)",
      "background-size": `${bgWidth}px ${bgHeight}px`,
      "background-position": `left ${
        x * -(gameState.containerSide / board().cols) - offsetX
      }px top ${
        y * -Math.floor(gameState.containerSide / board().rows) - offsetY
      }px`,
      transform: `${
        won() ? "" : "scale(0.75)"
      } rotate(calc(90deg * ${rotations}))`,
      "-webkit-tap-highlight-color": "transparent",
    };
  }

  function rotate(index: number, direction: number) {
    updateGame("tiles", index, (i) => i + direction);
  }

  let interval: ReturnType<typeof setInterval>;
  function startSolving() {
    let index = 0;
    clearInterval(interval);
    interval = setInterval(
      () => {
        while (Math.abs(gameState.tiles[index]) % 4 === 0) {
          index = (index + 1) % gameState.tiles.length;
        }
        const missing = gameState.tiles[index] % 4;
        rotate(index, Math.abs(missing) > 2 ? 1 : -1);

        if (won()) {
          clearInterval(interval);
        }
      },
      Math.min(
        1000,
        3000 / gameState.tiles.reduce((a, b) => a + Math.abs(b % 4), 0),
      ),
    );
  }

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

          <Button onClick={startSolving}>Solve</Button>
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
            <Index each={gameState.tiles}>
              {(rotations, index) => (
                <button
                  disabled={!!won()}
                  type="button"
                  class="box-content aspect-square appearance-none border bg-no-repeat transition-[transform,shadow] duration-300"
                  classList={{
                    "border-transparent": won(),
                    "shadow-xl": !won(),
                  }}
                  style={getQuadrantStyle(rotations(), index)}
                  {...{
                    ["ontouchstart" in window ? "onTouchStart" : "onClick"]: (
                      e: PointerEvent,
                    ) => {
                      e.preventDefault();
                      rotate(index, e.shiftKey ? -1 : 1);
                    },
                  }}
                />
              )}
            </Index>
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
