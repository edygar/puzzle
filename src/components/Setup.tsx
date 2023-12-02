import { For, createSignal, mergeProps } from "solid-js";
import { Title } from "./Title";
import { GridIcon } from "./GridIcon";
import { Select } from "./Select";
import { HStack, VStack } from "./VStack";
import { FileInput } from "./FileInput";
import { classed } from "@tw-classed/solid";
import { Button } from "./Button";

export const LEVELS = {
  Easy: 2,
  Regular: 3,
  Hard: 5,
  Expert: 10,
};

const Wrapper = classed.form("grid flex-1 items-center justify-center");

export function Setup(p: {
  initialSetup: { file: File | null; difficulty: number };
  onSubmit?: (data: FormData) => void;
}) {
  const props = mergeProps({ initialSetup: { file: null, difficulty: 3 } }, p);
  const [level, setLevel] = createSignal(props.initialSetup.difficulty);
  const [submittable, setSubmittable] = createSignal(false);

  function updateLevel(e: Event & { target: HTMLSelectElement }) {
    setLevel(parseInt(e.target.value, 10));
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
        if (e.target.form!.checkValidity()) {
          setSubmittable(true);
        }
      }}
      onSubmit={(e: Event & { target: HTMLFormElement }) => {
        e.preventDefault();
        props.onSubmit?.(new FormData(e.target));
      }}
    >
      <VStack gap={2}>
        <GridIcon tiles={level() ** 2} />
        <Title level="h1">It's Picture Puzzle Time</Title>

        <VStack gap={3} items="center">
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
                  selected={level == props.initialSetup.difficulty}
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
            required
            label={(files) => (
              <For each={Array.from(files)}>
                {(file) => (
                  <HStack gap={2} items="center">
                    <img
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
