import { ClassicPreset as Classic, GetSchemes, NodeEditor } from "rete";
import { DockPresets, DockPlugin } from "rete-dock-plugin";
import { Area2D, AreaExtensions, AreaPlugin } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import {
  ReactPlugin,
  ReactArea2D,
  Presets as ReactPresets,
} from "rete-react-plugin";
import { createRoot } from "react-dom/client";

import { DataflowEngine, DataflowNode } from "rete-engine";

import { MinimapExtra, MinimapPlugin } from "rete-minimap-plugin";
import {
  ReroutePlugin,
  RerouteExtra,
  RerouteExtensions,
} from "rete-connection-reroute-plugin";

type Node = NumberNode | AddNode;
type Conn =
  | Connection<NumberNode, AddNode>
  | Connection<AddNode, AddNode>
  | Connection<AddNode, NumberNode>;
type Schemes = GetSchemes<Node, Conn>;

class Connection<A extends Node, B extends Node> extends Classic.Connection<
  A,
  B
> {}

class NumberNode extends Classic.Node implements DataflowNode {
  width = 180;
  height = 120;

  constructor(initial: number, change?: (value: number) => void) {
    super("Number");

    this.addOutput("output", new Classic.Output(socket, "Number"));
    this.addControl(
      "value",
      new Classic.InputControl("number", { initial, change })
    );
  }
  data() {
    const value = (this.controls["value"] as Classic.InputControl<"number">)
      .value;

    return {
      value,
    };
  }
}

class AddNode extends Classic.Node implements DataflowNode {
  width = 180;
  height = 195;

  constructor() {
    super("Add");

    this.addInput("a", new Classic.Input(socket, "A", true));
    this.addInput("b", new Classic.Input(socket, "B"));
    this.addOutput("value", new Classic.Output(socket, "Number"));
    this.addControl(
      "result",
      new Classic.InputControl("number", { initial: 0, readonly: true })
    );
  }
  data(inputs: { a?: number[]; b?: number[] }) {
    console.log(inputs, "welcome");
    const { a = [], b = [] } = inputs;
    const sumA = a.reduce((e, a) => e + a, 0) || 0;
    const sumB = b.reduce((e, a) => e + a, 0) || 0;
    const sum = sumA + sumB;
    (this.controls["result"] as Classic.InputControl<"number">).setValue(sum);

    return {
      value: sum,
    };
  }
}

type AreaExtra =
  | Area2D<Schemes>
  | ReactArea2D<Schemes>
  | MinimapExtra
  | RerouteExtra;

const socket = new Classic.Socket("socket");

export async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const reactRender = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  const dock = new DockPlugin<Schemes>();
  const minimap = new MinimapPlugin<Schemes>();
  const reroutePlugin = new ReroutePlugin<Schemes>();
  const dataflow = new DataflowEngine<Schemes>();
  dock.addPreset(DockPresets.classic.setup({ area, size: 100, scale: 0.6 }));
  editor.use(area);
  editor.use(dataflow);

  area.use(reactRender);

  area.use(connection);

  area.use(minimap);

  area.use(dock);
  dock.add(() => new NumberNode(1, process));
  dock.add(() => new AddNode());
  reactRender.use(reroutePlugin);

  connection.addPreset(ConnectionPresets.classic.setup({}));
  reactRender.addPreset(ReactPresets.classic.setup());

  reactRender.addPreset(ReactPresets.minimap.setup());
  reactRender.addPreset(
    ReactPresets.reroute.setup({
      contextMenu(id) {
        reroutePlugin.remove(id);
      },
      translate(id, dx, dy) {
        reroutePlugin.translate(id, dx, dy);
      },
      pointerdown(id) {
        reroutePlugin.unselect(id);
        reroutePlugin.select(id);
      },
    })
  );

  const a = new NumberNode(1, process);
  const b = new NumberNode(1, process);
  const add = new AddNode();

  await editor.addNode(a);
  await editor.addNode(b);
  await editor.addNode(add);

  await editor.addConnection(new Connection(a, 'output', add, 'a'));
  await editor.addConnection(new Connection(b, 'output', add, 'b'));

  await area.nodeViews.get(a.id)?.translate(100, 100);
  await area.nodeViews.get(b.id)?.translate(100, 300);
  await area.nodeViews.get(add.id)?.translate(400, 150);

  AreaExtensions.zoomAt(area, editor.getNodes());

  // AreaExtensions.simpleNodesOrder(area);

  const selector = AreaExtensions.selector();
  const accumulating = AreaExtensions.accumulateOnCtrl();

  AreaExtensions.selectableNodes(area, selector, { accumulating });
  RerouteExtensions.selectablePins(reroutePlugin, selector, accumulating);

  async function process() {
    dataflow.reset();
    editor
      .getNodes()
      .filter((node) => node instanceof AddNode)
      .forEach(async (node) => {
        console.log(node.outputs);
        await dataflow.fetch(node.id);
        area.update(
          "control",
          (node.controls["result"] as Classic.InputControl<"number">).id
        );
      });
  }

  editor.addPipe((context) => {
    console.log(context)
    if (
      context.type === "connectioncreated" ||
      context.type === "connectionremoved"
    ) {
      process();
    }
    return context;
  });

  process();

  return {
    destroy: () => area.destroy(),
  };
}
