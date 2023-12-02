import { classed } from "@tw-classed/solid";

export const Button = classed.button(
  "relative",
  "appearance-none",
  "px-4 py-2",
  "bg-gray-50",
  "rounded-full",
  "cursor-pointer",
  "select-none",
  "[&:not(:disabled)]:active:translate-y-2",
  "[&:not(:disabled)]:active:[box-shadow:0_0px_0_0_#999999,0_0px_0_0_#99999941]",
  "[&:not(:disabled)]:active:border-transparent",
  "transition-all",
  "duration-150",
  "[box-shadow:0_8px_0_0_#999999,0_13px_0_0_#99999941]",
  "border-2",
  "border-gray-300",
  "focus-within:border-2",
  "focus-within:border-current",
  "disabled:text-gray-300",
  "disabled:cursor-not-allowed",
);
