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
      const res = await fetch("https://codecloud-backend.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      {/* Top Bar */}
      <div style={styles.nav}>
        <div style={styles.title}>CodeCloud</div>

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
        {/* Editor Card */}
        <div style={styles.cardLarge}>
          <div style={styles.label}>Code</div>

          <div style={styles.editor}>
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : "python"}
              theme="vs-light"
              value={code}
              onChange={(val) => setCode(val)}
            />
          </div>

          <div style={styles.label}>Input</div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input..."
            style={styles.input}
          />
        </div>

        {/* Output Card */}
        <div style={styles.cardSmall}>
          <div style={styles.label}>Output</div>

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
    background: "#f9f9f9",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    color: "#111"
  },

  nav: {
    height: "60px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px"
  },

  title: {
    fontSize: "18px",
    fontWeight: "600"
  },

  controls: {
    display: "flex",
    gap: "10px"
  },

  main: {
    flex: 1,
    display: "flex",
    gap: "20px",
    padding: "20px"
  },

  cardLarge: {
    flex: 1,
    background: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
  },

  cardSmall: {
    width: "35%",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
  },

  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#555"
  },

  editor: {
    flex: 1,
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #eee"
  },

  input: {
    height: "100px",
    borderRadius: "8px",
    border: "1px solid #eee",
    padding: "10px",
    fontSize: "14px",
    outline: "none",
    resize: "none"
  },

  output: {
    flex: 1,
    background: "#fafafa",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "10px",
    whiteSpace: "pre-wrap",
    overflow: "auto",
    fontSize: "14px"
  }
};