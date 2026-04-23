const express = require("express");
const cors = require("cors");
const { executeCode } = require("./executor");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CodeCloud API is running 🚀");
});

app.post("/run", async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Missing language or code" });
  }

  try {
    const output = await executeCode(language, code);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: "Execution failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});