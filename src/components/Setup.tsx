import { For, createSignal, mergeProps } from "solid-js";
import { Title } from "./Title";
import { GridIcon } from "./GridIcon";
import { Select } from "./Select";
import { HStack, VStack } from "./VStack";
import { FileInput } from "./FileInput";
import { classed } from "@tw-classed/solid";
import { Button } from "./Button";
import { createStore } from "solid-js/store";
import { GameSetup } from "../types";

export const LEVELS = {
  Easy: 2,
  Regular: 3,
  Hard: 5,
  Expert: 10,
};

const Wrapper = classed.form("grid flex-1 items-center justify-center");

export function Setup(p: {
  initialSetup: GameSetup;
  onSubmit?: (data: GameSetup) => void;
}) {
  const props = mergeProps(
    { initialSetup: { file: null, level: 3, mode: "rotate" } },
    p,
  );
  const [gameSetup, updateSetup] = createStore<GameSetup>({
    file: props.initialSetup.file,
    level: props.initialSetup.level,
    mode: props.initialSetup.mode,
  });
  const [submittable, setSubmittable] = createSignal(false);

  function updateLevel(e: Event & { target: HTMLSelectElement }) {
    updateSetup("level", parseInt(e.target.value, 10));
  }

  function buildFiles() {
    if (!props.initialSetup.file) return null;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(props.initialSetup.file);
    return dataTransfer.files;
  }

  function checkInitialValidity(el: HTMLFormElement | null) {
    if (el === null) return;

    if (el.checkValidity()) {
      setSubmittable(true);
    }
  }

  return (
    <Wrapper
      ref={checkInitialValidity}
      onChange={(
        e: Event & { target: HTMLInputElement | HTMLSelectElement },
      ) => {
        if (e.target.form?.checkValidity()) {
          setSubmittable(true);
        }
      }}
      onSubmit={(e: Event & { target: HTMLFormElement }) => {
        e.preventDefault();
        props.onSubmit?.({ ...gameSetup });
      }}
    >
      <VStack gap={2}>
        <GridIcon tiles={gameSetup.level ** 2} />
        <Title level="1">It's Picture Puzzle Time</Title>

        <VStack gap={3} items="center">
          <Select
            onChange={(e) => updateSetup("mode", e.target.value)}
            name="mode"
            required
            placeholder="Mode"
          >
            <option selected={gameSetup.mode === "rotate"} value="rotate">
              Rotate
            </option>
            <option selected={gameSetup.mode === "slide"} value="slide">
              Slide
            </option>
          </Select>
          <Select
            onChange={updateLevel}
            name="difficulty"
            required
            placeholder="Difficulty level"
          >
            <For each={Object.entries(LEVELS)}>
              {([label, level]) => (
                <option
                  value={level}
                  selected={level === props.initialSetup.level}
                >
                  Difficulty: {label} ({level}x{level})
                </option>
              )}
            </For>
          </Select>

          <FileInput
            defaultValue={buildFiles()}
            name="file"
            accept="image/*"
            onChange={(e) => {
              e.target.files && updateSetup("file", e.target.files[0]);
            }}
            required
            label={(files) => (
              <For each={Array.from(files)}>
                {(file) => (
                  <HStack gap={2} items="center">
                    <img
                      alt="Preview of the game theme"
                      src={URL.createObjectURL(file)}
                      class="h-[1em] object-scale-down"
                    />
                    <span>"{file.name}"</span>
                  </HStack>
                )}
              </For>
            )}
          />
          <Button class="mt-5" type="submit" disabled={!submittable()}>
            Start game
          </Button>
        </VStack>
      </VStack>
    </Wrapper>
  );
}
