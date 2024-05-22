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
import { DataflowEngine } from "rete-engine";
import { AutoArrangePlugin, Presets } from "rete-auto-arrange-plugin";

import { MinimapExtra, MinimapPlugin } from "rete-minimap-plugin";
import {
  ReroutePlugin,
  RerouteExtra,
  RerouteExtensions,
} from "rete-connection-reroute-plugin";

import { dockNodes } from "./mockData";
import NodeGenarator from "./NodeGen";
type Node = NodeGenarator;
type Conn = Connection<Node, Node>
type Schemes = GetSchemes<Node, Conn>;

class Connection<A extends Node, B extends Node> extends Classic.Connection<
  A,
  B
> {}

type AreaExtra =
  | Area2D<Schemes>
  | ReactArea2D<Schemes>
  | MinimapExtra
  | RerouteExtra;

export async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const reactRender = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  const dock = new DockPlugin<Schemes>();
  const minimap = new MinimapPlugin<Schemes>();
  const reroutePlugin = new ReroutePlugin<Schemes>();
  const dataflow = new DataflowEngine<Schemes>();
  const arrange = new AutoArrangePlugin<Schemes, AreaExtra>();
  const socket = new Classic.Socket("socket");
  arrange.addPreset(Presets.classic.setup({}));
  editor.use(area);
  dock.addPreset(DockPresets.classic.setup({ area, size: 100, scale: 0.6 }));
//   dockNodes.forEach(async (e) => {
//     await editor.addNode(new NodeGenarator(process, e as any, socket));
//   });
  editor.use(dataflow);

  area.use(reactRender);

  area.use(arrange);

  area.use(connection);

  area.use(minimap);

  area.use(dock);

  reactRender.use(reroutePlugin);
  connection.addPreset(ConnectionPresets.classic.setup());
  reactRender.addPreset(ReactPresets.classic.setup());

  dockNodes.forEach((e) => {
    const Node = () =>new NodeGenarator(process, e as any, socket)
    dock.add(Node);
  });
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

  await AreaExtensions.zoomAt(area, editor.getNodes());
  AreaExtensions.simpleNodesOrder(area);

  const selector = AreaExtensions.selector();
  const accumulating = AreaExtensions.accumulateOnCtrl();
  AreaExtensions.selectableNodes(area, selector, { accumulating });
  RerouteExtensions.selectablePins(reroutePlugin, selector, accumulating);

  async function process() {
    // dataflow.reset();
    // editor
    //   .getNodes()
    //   .filter((node) => node instanceof )
    //   .forEach(async (node) => {
    //     console.log(node.outputs);
    //     await dataflow.fetch(node.id);
    //     area.update(
    //       "control",
    //       (node.controls["result"] as Classic.InputControl<"number">).id
    //     );
    //   });
  }

  editor.addPipe(async (context) => {
    console.log(context);
    if (
      context.type === "connectioncreated" ||
      context.type === "connectionremoved"
    ) {
      process();
    }
    if (context.type === "nodecreated") {
      await arrange.layout();
    }
    return context;
  });

  process();

  return {
    destroy: () => area.destroy(),
    editor,
  };
}
