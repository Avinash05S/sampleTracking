import { ClassicPreset as Classic } from "rete";

import { DataflowNode } from "rete-engine";
import { Input, Output, dockNodes as node } from "./mockData";
import { generateUUID } from "three/src/math/MathUtils.js";
//import { v4 as uuid } from "uuid";

const InputMap = new Map<string, (typeof Output)[0]>();
Output.forEach((e) => {
  InputMap.set(e.outputId, e);
});
const OutputMap = new Map<string, (typeof Input)[0]>();
Input.forEach((e) => {
  OutputMap.set(e.inputId, e);
});


class NodeGenarator extends Classic.Node implements DataflowNode {
  width = 180;
  height = 120;
  defaultId: string;
  constructor(
    change: (value: any) => void,
    data: (typeof node)[0] & { incharge: string, defaultId: string },
    socket: Classic.Socket,
    duplicate?: boolean
  ) {
    super(data.title);
    const { incharge = null, input, output, nodeId } = data;
    this.id = !duplicate ? nodeId : generateUUID();
    this.defaultId = "234jhfg234hg3";
    console.log(`this.id`, this.id)
    console.log(`creatring node here`)
    input.forEach((e) => {
      const inputValue = OutputMap.get(e);
      this.addInput(e, new Classic.Input(socket, inputValue?.label, true));
    });
    output.forEach((e) => {
      const outputValue = InputMap.get(e);
      this.addOutput(e, new Classic.Output(socket, outputValue?.label));
    });
    this.addControl(
      "InCharge",
      new Classic.InputControl("text", { initial: incharge || "", change })
    );
  }
  data() {
    // const value =
    //   (this.controls["value"] as Classic.InputControl<"text">).value || "";

    return {
      value: 1,
    };
  }
}

export default NodeGenarator;
