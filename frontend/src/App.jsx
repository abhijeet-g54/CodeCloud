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
      const res = await fetch("https://YOUR_RENDER_URL.onrender.com/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ language, code, input })
      });

      const data = await res.json();
      setOutput(data.output);
    } catch {
      setOutput("Error connecting to server");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>☁️ CodeCloud</h1>

      <div style={styles.toolbar}>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        <button onClick={runCode}>▶ Run</button>
      </div>

      <div style={styles.main}>
        {/* LEFT: CODE EDITOR */}
        <div style={styles.editorPane}>
          <Editor
            height="100%"
            language={language === "cpp" ? "cpp" : "python"}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val)}
          />

          <textarea
            placeholder="Input (stdin)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.inputBox}
          />
        </div>

        {/* RIGHT: OUTPUT */}
        <div style={styles.outputPane}>
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column"
  },
  title: {
    textAlign: "center",
    padding: "10px"
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px"
  },
  main: {
    display: "flex",
    flex: 1
  },
  editorPane: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  outputPane: {
    width: "35%",
    background: "#020617",
    padding: "15px",
    overflow: "auto"
  },
  inputBox: {
    height: "100px",
    background: "#020617",
    color: "white",
    border: "none",
    padding: "10px"
  }
};