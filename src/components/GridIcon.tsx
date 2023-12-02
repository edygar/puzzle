import { For, createEffect, createSignal, onCleanup } from "solid-js";

export function GridIcon(props: { tiles: number; width?: number | string }) {
  const [animated, setAnimated] = createSignal(0);

  createEffect(() => {
    const tiles = props.tiles;
    const interval = setInterval(setAnimated, 1000, () =>
      Math.floor(Math.random() * tiles),
    );
    onCleanup(() => clearInterval(interval));
  });

  return (
    <div
      class="m-auto grid aspect-square shadow"
      style={{
        "--w": props.width ?? "80px",
        "--tilesPerAxis": props.tiles ** (1 / 2),
        width: "var(--w)",
        gap: "calc(var(--w) / var(--tilesPerAxis) * 0.2)",
        "grid-template-columns": `repeat(var(--tilesPerAxis), minmax(0, 1fr))`,
      }}
    >
      <For each={Array.from({ length: props.tiles })}>
        {(_, i) => (
          <button
            type="button"
            class="border border-white bg-white/70"
            classList={{
              "transition duration-300": i() === animated(),
            }}
            style={i() === animated() ? { transform: "rotate(90deg)" } : {}}
            onClick={() => setAnimated(i())}
          />
        )}
      </For>
    </div>
  );
}
