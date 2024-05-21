// import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
// import { DockPlugin, DockPresets } from "rete-dock-plugin"
// import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';
// import {
//     ConnectionPlugin,
//     Presets as ConnectionPresets,
// } from 'rete-connection-plugin';
// import {
//     ReactPlugin,
//     ReactArea2D,
//     Presets as ReactPresets,
// } from 'rete-react-plugin';
// import { createRoot } from 'react-dom/client';

// import { DataflowEngine } from 'rete-engine';

// import { MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin';
// import {
//     ReroutePlugin,
//     RerouteExtra,
//     RerouteExtensions,
// } from 'rete-connection-reroute-plugin';
// import Node from "./node"

// class Connection<A extends Node, B extends Node> extends Classic.Connection<
//     A,
//     B
// > { }

// type AreaExtra =
//     | Area2D<Schemes>
//     | ReactArea2D<Schemes>
//     | MinimapExtra
//     | RerouteExtra;
// type Schemes = GetSchemes<Node, Conn>;

// type Conn = Connection<Node, Node>

// export const createEditor = async (container: HTMLElement) => {
//     const editor = new NodeEditor<Schemes>();
//     const area = new AreaPlugin<Schemes, AreaExtra>(container);
//     const connection = new ConnectionPlugin<Schemes, AreaExtra>();
//     const reactRender = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
//     const dock = new DockPlugin();

//     dock.addPreset(DockPresets.classic.setup({ area, size: 100, scale: 0.6 }));

//     area.use(dock)

//     const minimap = new MinimapPlugin<Schemes>();
//     const reroutePlugin = new ReroutePlugin<Schemes>();
//     editor.use(area);

//     area.use(reactRender);

//     area.use(connection);

//     area.use(minimap);
//     reactRender.use(reroutePlugin);

//     connection.addPreset(ConnectionPresets.classic.setup());
//     reactRender.addPreset(ReactPresets.classic.setup());
//     reactRender.addPreset(ReactPresets.minimap.setup());
//     reactRender.addPreset(
//         ReactPresets.reroute.setup({
//             contextMenu(id) {
//                 reroutePlugin.remove(id);
//             },
//             translate(id, dx, dy) {
//                 reroutePlugin.translate(id, dx, dy);
//             },
//             pointerdown(id) {
//                 reroutePlugin.unselect(id);
//                 reroutePlugin.select(id);
//             },
//         })
//     );

//     const dataflow = new DataflowEngine<Schemes>();

//     editor.use(dataflow);

//     const a = new Node("node1");
//     const b = new Node("node2");

//     dock.add(()=>a);
//     dock.add(()=>b);

//     await editor.addNode(a);
//     await editor.addNode(b);

//     //   await editor.addConnection(new Connection(a, 'value', add, 'a'));
//     //   await editor.addConnection(new Connection(b, 'value', add, 'b'));

//     await area.nodeViews.get(a.id)?.translate(100, 100);
//     await area.nodeViews.get(b.id)?.translate(100, 300);
//     //   await area.nodeViews.get(add.id)?.translate(400, 150);

//     AreaExtensions.zoomAt(area, editor.getNodes());

//     AreaExtensions.simpleNodesOrder(area);

//     const selector = AreaExtensions.selector();
//     const accumulating = AreaExtensions.accumulateOnCtrl();

//     AreaExtensions.selectableNodes(area, selector, { accumulating });
//     RerouteExtensions.selectablePins(reroutePlugin, selector, accumulating);

//     async function process() {
//         dataflow.reset();

//         editor
//             .getNodes()
//             .filter((node) => node instanceof Node)
//             .forEach(async (node) => {
//                 const sum = await dataflow.fetch(node.id);

//                 console.log(node.id, 'produces', sum);

//                 area.update(
//                     'control',
//                     (node.controls['result'] as Classic.InputControl<'number'>).id
//                 );
//             });
//     }
//     editor.addPipe((context) => {
//         console.log(context)
//         if (
//             context.type === 'connectioncreated' ||
//             context.type === 'connectionremoved'
//         ) {
//             process();
//         }
//         return context;
//     });

//     process();

//     return {
//         destroy: () => area.destroy(),
//         editor
//     };
// }

import { createRoot } from "react-dom/client";
import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";
import { DockPlugin, DockPresets } from "rete-dock-plugin";
import { DataflowEngine } from "rete-engine";

type Nodes = NodeA | NodeB;

type Schemes = GetSchemes<Nodes, Connection<Nodes>>;
type AreaExtra = ReactArea2D<any>;

class Connection<N extends Nodes> extends ClassicPreset.Connection<N, N> {}

const connectionEvents = new Set(["connectioncreated", "connectionremoved"]);

class NodeA extends ClassicPreset.Node {
  constructor(socket: ClassicPreset.Socket) {
    super("A");
    this.addControl("a", new ClassicPreset.InputControl("text", {}));
    this.addOutput("a", new ClassicPreset.Output(socket));
  }
  data() {
    return { value: 1 };
  }
}

class NodeB extends ClassicPreset.Node {
  constructor(socket: ClassicPreset.Socket) {
    super("B");
    this.addControl("b", new ClassicPreset.InputControl("text", {}));
    this.addInput("b", new ClassicPreset.Input(socket, "B", true));
  }
  data(val:any) {
    console.log(val);
    (this.controls['result'] as ClassicPreset.InputControl<'number'>).setValue(9)
    return { value: 1 };
  }
}

export async function createEditor(container: HTMLElement) {
  const socket = new ClassicPreset.Socket("socket");
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  const dock = new DockPlugin<Schemes>();
  const dataflow = new DataflowEngine<Schemes>();

  dock.addPreset(DockPresets.classic.setup({ area, size: 100, scale: 0.6 }));

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  render.addPreset(Presets.classic.setup());

  connection.addPreset(ConnectionPresets.classic.setup());

  editor.use(area);
  editor.use(dataflow)
  area.use(connection);
  area.use(render);
  area.use(dock);
  dock.add(() => new NodeA(socket));
  dock.add(() => new NodeB(socket));

  AreaExtensions.simpleNodesOrder(area);

  const a = new NodeB(socket);
  await editor.addNode(a);

  editor.addPipe((context) => {
    if (connectionEvents.has(context.type)) {
      const {
        data: { target },
      } = (context as { type: string; data: any }) || {
        data: { source: null, target: null },
      };
     process(target)
    }
    return context;
  });
  async function process(target: string | null = null) {
    // dataflow.reset();
    if (target) {
      const sourceNode = editor.getNode(target).controls["b"]?.id || "efwre";
      await dataflow.fetch(target)
      area.update("control", sourceNode);
    } else {
      console.log("welcome Deepak")
      editor
        .getNodes()
        .filter((node) => node instanceof NodeB)
        .forEach(async (node) => {
          await dataflow.fetch(node.id)
          area.update(
            "control",
            (node.controls["b"] as ClassicPreset.InputControl<"number">).id
          );
        });
    }
  }
  AreaExtensions.zoomAt(area, editor.getNodes());

  process();
  return {
    destroy: () => area.destroy(),
    area,
    editor,
  };
}
