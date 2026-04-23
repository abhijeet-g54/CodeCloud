import { useState } from "react";

export default function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    setOutput("Running...");

    try {
      const res = await fetch("https://codecloud-backend.onrender.com/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ language, code })
      });

      const data = await res.json();
      setOutput(data.output);
    } catch (err) {
      setOutput("Error connecting to server");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>CodeCloud 🚀</h1>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
      </select>

      <br /><br />

      <textarea
        rows="10"
        cols="60"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
      />

      <br /><br />

      <button onClick={runCode}>Run Code</button>

      <h3>Output:</h3>
      <pre>{output}</pre>
    </div>
  );
}