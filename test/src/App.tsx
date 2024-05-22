import { useRete } from "rete-react-plugin";
import "./App.css";
// import { createEditor } from "./components/basicCreation";
import { createEditor } from "./structured";
import "./rete.css";

function App() {
  const [ref, editor] = useRete(createEditor);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* <div
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
            // editor?.arrange.layout();
            console.log(editor?.editor.getConnections());
            console.log(editor?.editor.getNodes());
            // console.log(editor?.editor.getNodes());
          }}
        >
          Get Nodes
        </button>
      </div> */}
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
