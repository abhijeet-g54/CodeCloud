import { useState } from "react";

export default function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    setOutput("Running...");

    try {
      const res = await fetch("https://YOUR_RENDER_URL.onrender.com/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ language, code })
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
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={styles.select}
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        <button onClick={runCode} style={styles.button}>
          ▶ Run Code
        </button>
      </div>

      <textarea
        style={styles.editor}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
      />

      <div style={styles.outputBox}>
        <h3>Output</h3>
        <pre style={styles.output}>{output}</pre>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "monospace"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px"
  },
  select: {
    padding: "8px",
    background: "#1e293b",
    color: "white",
    border: "1px solid #334155",
    borderRadius: "6px"
  },
  button: {
    padding: "8px 16px",
    background: "#22c55e",
    color: "black",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  editor: {
    width: "100%",
    height: "300px",
    background: "#020617",
    color: "#38bdf8",
    border: "1px solid #334155",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "14px",
    marginBottom: "20px"
  },
  outputBox: {
    background: "#020617",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #334155"
  },
  output: {
    color: "#22c55e",
    whiteSpace: "pre-wrap"
  }
};