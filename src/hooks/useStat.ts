import { clamp } from "@foxkit/util/clamp";
import { useState } from "preact/hooks";
import type { ElementProps } from "~/components/jsx";

export interface StatProps {
  current: ElementProps<"input">;
  target: ElementProps<"input">;
}

type InputChangeEvent = NonNullable<ElementProps<"input">["onChange"]>;

export function useStat(
  min: number,
  max: number,
  owned: boolean,
  initial: [number, number]
) {
  const [stat, setStat] = useState(initial);

  // reset current level to min if servant is not owned
  if (!owned && stat[0] != min) setStat(stat => [min, stat[1]]);

  const setCurrent: InputChangeEvent = ev => {
    let target = stat[1];
    const value = ev.currentTarget.valueAsNumber;
    const current = clamp({ min, max, value });
    if (current > target) target = current;
    setStat([current, target]);
  };

  const setTarget: InputChangeEvent = ev => {
    let current = stat[0];
    const value = ev.currentTarget.valueAsNumber;
    const target = clamp({ min, max, value });
    if (target < current) current = target;
    setStat([current, target]);
  };

  const props: StatProps = {
    current: { type: "number", value: stat[0], min, max, onChange: setCurrent },
    target: { type: "number", value: stat[1], min, max, onChange: setTarget }
  };

  if (!owned) props.current.readOnly = true;

  return props;
}
