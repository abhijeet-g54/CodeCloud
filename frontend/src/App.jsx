import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function App() {
  const [code, setCode] = useState("print('Hello CodeCloud')");
  const [language, setLanguage] = useState("python");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    setOutput("Running...");

    try {
      const res = await fetch("https://codecloud-backend.onrender.com/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ language, code, input })
      });

      const data = await res.json();
      setOutput(data.output || (data.outputs ? data.outputs.join("\n---\n") : "No output"));
    } catch {
      setOutput("Error connecting to server");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>☁️ CodeCloud</h2>
        <div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
          <button onClick={runCode}>Run</button>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.editorPane}>
          <div style={styles.editorWrapper}>
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : "python"}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val)}
            />
          </div>

          <textarea
            placeholder="Input (stdin)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.inputBox}
          />
        </div>

        <div style={styles.outputPane}>
          <h3>Output</h3>
          <pre style={styles.output}>{output}</pre>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "#0f172a",
    color: "white",
    fontFamily: "sans-serif"
  },
  header: {
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#020617"
  },
  main: {
    flex: 1,
    display: "flex",
    overflow: "hidden"
  },
  editorPane: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  editorWrapper: {
    flex: 1
  },
  inputBox: {
    height: "120px",
    background: "#020617",
    color: "white",
    border: "none",
    padding: "10px",
    resize: "none"
  },
  outputPane: {
    width: "35%",
    background: "#020617",
    padding: "15px",
    overflow: "auto"
  },
  output: {
    whiteSpace: "pre-wrap"
  }
};