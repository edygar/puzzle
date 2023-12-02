import {
  Component,
  ComponentProps,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  splitProps,
} from "solid-js";
import { Button } from "./Button";

export const Select: Component<
  ComponentProps<"select"> & { placeholder?: string }
> = (props) => {
  const [label, setLabel] = createSignal("");
  const [inputProps, rootProps] = splitProps(props, [
    "name",
    "form",
    "disabled",
    "required",
    "autofocus",
    "onChange",
    "onInput",
    "onReset",
  ]);

  async function watchLabel(select: HTMLSelectElement) {
    if (!select) return;

    const updateLabel = () => {
      setLabel(select.querySelector("option:checked")?.textContent || "");
    };
    select.addEventListener("change", updateLabel);
    onCleanup(() => {
      select.removeEventListener("change", updateLabel);
    });

    Promise.resolve().then(updateLabel);
  }

  return (
    <Button
      as="label"
      tabIndex={-1}
      class="inline-flex items-center justify-between border-2 border-transparent after:ml-2 after:inline-block after:h-0 after:w-0 after:border-8 after:border-b-0 after:border-transparent after:border-t-current after:align-middle after:content-['']"
      {...props}
    >
      <select
        {...inputProps}
        ref={watchLabel}
        id="level"
        class="absolute inset-0 opacity-0"
      >
        {props.children}
      </select>
      <Show
        when={!!label()}
        fallback={<span class="opacity-40">{props.placeholder}</span>}
      >
        {label()}
      </Show>
    </Button>
  );
};
