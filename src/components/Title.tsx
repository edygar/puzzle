import { classed } from "@tw-classed/solid";
import { ComponentProps } from "solid-js";

const BaseTitle = classed.h1(
  "my-3 [text-shadow:_0_2px_5px_rgba(0,0,0,.5)] text-center text-white",
  {
    variants: {
      level: {
        6: "text-md",
        5: "text-lg",
        4: "text-xl",
        3: "text-2xl",
        2: "text-4xl",
        1: "text-6xl",
      },
    },
  },
);

type TitleProps<L extends 1 | 2 | 3 | 4 | 5 | 6> = ComponentProps<`h${L}`> &
  ComponentProps<typeof BaseTitle>;

export const Title = <L extends 1 | 2 | 3 | 4 | 5 | 6>(
  props: TitleProps<L>,
) => <BaseTitle as={`h${props.level || 1}`} {...props} />;
