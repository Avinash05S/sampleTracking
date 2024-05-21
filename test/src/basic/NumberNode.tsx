import { ClassicPreset as Classic } from "rete";

import { DataflowNode } from "rete-engine";

const socket = new Classic.Socket("socket");

interface InitProps {
  initial: string | number;
  change: (val: any) => void;
  label: string;
  type: "text" | "number";
}

class Node extends Classic.Node implements DataflowNode {
  width = 180;
  height = 120;

  constructor({ initial, change, label, type = "text" }: InitProps) {
    super(label);
    // this.label = "Deepak";
    this.addOutput("value", new Classic.Output(socket, "Number"));
    this.addControl(
      "value",
      new Classic.InputControl(type, { initial, change })
    );
  }
  data() {
    const value =
      (this.controls["value"] as Classic.InputControl<"text">).value || "";

    return {
      value,
    };
  }
}

export default Node;
