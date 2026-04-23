import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function App() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("print('Hello CodeCloud')");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const templates = {
    python: "print('Hello CodeCloud')",
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello CodeCloud";
    return 0;
}`
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setCode(templates[lang]);
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("https://YOUR_RENDER_URL.onrender.com/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ language, code, input })
      });

      const data = await res.json();
      setOutput(data.output || "No output");
    } catch {
      setOutput("Error connecting to server");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>CodeCloud</h2>

        <div style={styles.controls}>
          <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <button onClick={runCode} disabled={loading}>
            {loading ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={styles.main}>
        {/* Left */}
        <div style={styles.left}>
          <label style={styles.label}>Code</label>

          <div style={styles.editor}>
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : "python"}
              theme="vs-light"
              value={code}
              onChange={(val) => setCode(val)}
            />
          </div>

          <label style={styles.label}>Input</label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input..."
            style={styles.input}
          />
        </div>

        {/* Right */}
        <div style={styles.right}>
          <label style={styles.label}>Output</label>

          <pre style={styles.output}>
            {output || "Run code to see output"}
          </pre>
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
    background: "#f5f5f5",
    fontFamily: "Arial, sans-serif"
  },

  header: {
    padding: "10px 20px",
    background: "#ffffff",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  controls: {
    display: "flex",
    gap: "10px"
  },

  main: {
    flex: 1,
    display: "flex",
    gap: "10px",
    padding: "10px"
  },

  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  right: {
    width: "35%",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333"
  },

  editor: {
    flex: 1,
    border: "1px solid #ccc",
    borderRadius: "6px",
    overflow: "hidden"
  },

  input: {
    height: "120px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    resize: "none"
  },

  output: {
    flex: 1,
    background: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px",
    whiteSpace: "pre-wrap",
    overflow: "auto"
  }
};