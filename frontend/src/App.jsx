import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function App() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("print('Hello CodeCloud')");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>☁️ CodeCloud</h2>

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

      {/* Main */}
      <div style={styles.main}>
        {/* Editor Side */}
        <div style={styles.left}>
          <div style={styles.sectionTitle}>Editor</div>

          <div style={styles.editor}>
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : "python"}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
            />
          </div>

          <div style={styles.sectionTitle}>Input (stdin)</div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input here..."
            style={styles.input}
          />
        </div>

        {/* Output Side */}
        <div style={styles.right}>
          <div style={styles.sectionTitle}>Output</div>

          <pre style={styles.output}>
            {output || "Run your code to see output"}
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
    background: "#0f172a",
    color: "#e2e8f0",
    fontFamily: "sans-serif"
  },

  header: {
    padding: "12px 20px",
    background: "#020617",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #1e293b"
  },

  controls: {
    display: "flex",
    gap: "10px"
  },

  main: {
    flex: 1,
    display: "flex",
    overflow: "hidden"
  },

  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    gap: "8px"
  },

  right: {
    width: "35%",
    padding: "10px",
    background: "#020617",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  sectionTitle: {
    fontSize: "14px",
    color: "#94a3b8",
    fontWeight: "bold"
  },

  editor: {
    flex: 1,
    border: "1px solid #1e293b",
    borderRadius: "6px",
    overflow: "hidden"
  },

  input: {
    height: "120px",
    background: "#020617",
    color: "#e2e8f0",
    border: "1px solid #1e293b",
    borderRadius: "6px",
    padding: "10px",
    resize: "none"
  },

  output: {
    flex: 1,
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: "6px",
    padding: "10px",
    whiteSpace: "pre-wrap",
    overflow: "auto"
  }
};