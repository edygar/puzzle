import {
  Component,
  ComponentProps,
  JSX,
  createSignal,
  mergeProps,
  onCleanup,
  splitProps,
} from "solid-js";
import { Button } from "./Button";

export const FileInput: Component<
  ComponentProps<"input"> & {
    defaultValue?: FileList | null;
    placeholder?: string;
    label?: string | ((input: FileList) => JSX.Element);
  }
> = (p) => {
  const [files, setFiles] = createSignal<FileList | null>(null);
  const props = mergeProps(
    {
      placeholder: "Choose a file…",
      label: (files: FileList) =>
        Array.from([...files], (file) => file.name).join(", "),
    },
    p,
  );
  const [inputProps, rootProps] = splitProps(props, [
    "name",
    "accept",
    "autofocus",
    "disabled",
    "form",
    "multiple",
    "onChange",
    "onInput",
    "onReset",
    "required",
    "size",
  ]);
  const [, rest] = splitProps(rootProps, ["label", "value"]);

  function renderLabel() {
    const list = files();
    const label = props.label;
    if (typeof label === "function") {
      if (list !== null && [...list].length) return label(list);

      return <span class="opacity-80">{props.placeholder}</span>;
    }

    return (
      (label as JSX.Element) || (
        <span class="opacity-80">{props.placeholder}</span>
      )
    );
  }

  function watch(input: HTMLInputElement) {
    if (!input) return;

    if (props.defaultValue) {
      input.files = props.defaultValue;
      setFiles(props.defaultValue);
    }

    const updateFiles = () => {
      setFiles(input.files);
    };

    input.addEventListener("change", updateFiles);
    onCleanup(() => {
      input.removeEventListener("change", updateFiles);
    });
  }

  return (
    <Button as="label" {...rest}>
      {renderLabel()}
      <input
        ref={watch}
        type="file"
        class="absolute inset-0 opacity-0"
        {...inputProps}
      />
    </Button>
  );
};
