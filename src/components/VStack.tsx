import { classed } from "@tw-classed/solid";

const common = {
  items: {
    center: "items-center",
    start: "items-start",
    end: "items-end",
  },
  justify: {
    center: "justify-center",
    start: "justify-start",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  },
  gap: {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
  },
};
export const VStack = classed.div("flex flex-col", {
  variants: {
    ...common,
  },
});
export const HStack = classed.div("flex flex-row", {
  variants: {
    ...common,
  },
});
