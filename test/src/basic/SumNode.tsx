import { ClassicPreset as Classic } from "rete";
import { DataflowNode } from "rete-engine";

const socket = new Classic.Socket("socket");

class SumNode extends Classic.Node implements DataflowNode {
  width = 180;
  height = 195;

  constructor() {
    super("Add");

    this.addInput("a", new Classic.Input(socket, "A", true));
    this.addInput("b", new Classic.Input(socket, "B"));
    this.addOutput("value", new Classic.Output(socket, "Number"));
    this.addControl(
      "result",
      new Classic.InputControl("text", { initial: 0, readonly: true })
    );
  }
  data(inputs: { a?: (number | string)[]; b?: (string | number)[] }) {
    console.log(inputs, "welcome");
    const { a = [], b = [] } = inputs;
    const sumA =
      a.reduce(
        (e, a) =>
          typeof e === "string"
            ? e.concat(a as string)
            : (e || 0) + (a as number),
        ""
      ) || "";
    const sumB =
      b.reduce(
        (e, a) =>
          typeof e === "string"
            ? e.concat(a as string)
            : (e || 0) + (a as number),
        ""
      ) || "";
    const sum =
      typeof sumA === "string"
        ? sumA.concat(sumB.toString())
        : sumA + (sumB as number);
    (
      this.controls["result"] as Classic.InputControl<"number" | "text">
    ).setValue(sum);

    return {
      value: sum,
    };
  }
}

export default SumNode;
