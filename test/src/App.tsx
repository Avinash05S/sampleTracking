import { useRete } from "rete-react-plugin";
import "./App.css";
// import { createEditor } from "./components/basicCreation";
import { createEditor } from "./structured";
import "./rete.css";
import { useEffect, useState } from "react";

function App() {
  const [ref, editor] = useRete(createEditor);
  const [nodeData, setNodeData] = useState();

  const fetchNodes = async () => {
    try {
      const response = await fetch(`/mapping-nodes`);
      console.log(response, `response`);
      if (response.status) {
        const data = await response.json();
        console.log(data, `response data`);
        setNodeData(data);
      } else {
        window.alert(`Fetch node failed`)
      }
    } catch (error) {
      window.alert(`Error : ${error}`)
    }
  };


  const handleSaveData = (nodes: any, connections: any) => {
    let nodeData: { node_id: string; title: string; incharge_id: string; tracking_id: string; }[] = [];
    nodes.forEach((e: any) => {
      nodeData.push({
        node_id: e.id,
        title: e.label,
        incharge_id: "",
        tracking_id: "",
      })
    });
    let connectionData: { source_node: string; target_node: string; tracking_id: string; connection_id: string; }[] = [];
    connections.forEach((e: any) => {
      connectionData.push({
        source_node: e.source,
        target_node: e.target,
        tracking_id: "",
        connection_id: e.id,
      })
    });

    let nodesObj = {
      nodes: nodeData,
      connections: connectionData,
      removedNodes: [],
      removedConnections: []
    };
    console.log(`nodeData`, nodesObj);

    return nodesObj
  };

  // useEffect(() => {
  //   //fetchNodes();
  // }, []);
  console.log(`nodeData`, nodeData);
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div
        style={{
          height: "10%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          style={{
            padding: "10px",
            border: "1px solid gray",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 550,
            cursor: "pointer",
          }}
          onClick={async () => {
            let nodes = editor?.editor.getNodes();
            let connections = editor?.editor.getConnections()
            handleSaveData(nodes, connections)
          }}
        >
          Save Pipeline
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90%",
          padding: "20px",
        }}
      >
        <div
          style={{ height: "100%", margin: 0, border: "1px solid blue" }}
          ref={ref}
          className="rete"
        ></div>
      </div>
    </div>
  );
}

export default App;
