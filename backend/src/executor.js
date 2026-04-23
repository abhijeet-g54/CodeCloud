const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function executeCode(language, code) {
  return new Promise((resolve) => {
    const fileId = Date.now();

    const baseDir = __dirname; // IMPORTANT: ensures correct path in /src

    let filePath = "";
    let runCommand = "";
    let args = [];

    if (language === "python") {
      filePath = path.join(baseDir, `${fileId}.py`);
      fs.writeFileSync(filePath, code);

      runCommand = "python3";
      args = [filePath];
    } 
    
    else if (language === "cpp") {
      const cppPath = path.join(baseDir, `${fileId}.cpp`);
      const outPath = path.join(baseDir, `${fileId}.out`);

      fs.writeFileSync(cppPath, code);

      runCommand = "g++";
      args = [cppPath, "-o", outPath];

      filePath = { cppPath, outPath };
    } 
    
    else {
      return resolve("Unsupported language");
    }

    let output = "";
    let errorOutput = "";

    const process = spawn(runCommand, args);

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    process.on("close", (codeExit) => {
      // If C++ compile succeeded → run executable
      if (language === "cpp" && codeExit === 0) {
        const exec = spawn(filePath.outPath);

        exec.stdout.on("data", (data) => {
          output += data.toString();
        });

        exec.stderr.on("data", (data) => {
          errorOutput += data.toString();
        });

        exec.on("close", () => {
          cleanup(fileId);
          if (errorOutput) return resolve(errorOutput.trim());
          resolve((output || "No output").trim());
        });

        setTimeout(() => {
          exec.kill("SIGKILL");
          cleanup(fileId);
          resolve("Execution timed out (5 seconds)");
        }, 5000);
      } else {
        cleanup(fileId);
        if (errorOutput) return resolve(errorOutput.trim());
        resolve((output || "No output").trim());
      }
    });

    setTimeout(() => {
      process.kill("SIGKILL");
      cleanup(fileId);
      resolve("Execution timed out (5 seconds)");
    }, 5000);
  });
}

function cleanup(fileId) {
  const baseDir = __dirname;

  const files = [
    `${fileId}.py`,
    `${fileId}.cpp`,
    `${fileId}.out`
  ];

  files.forEach((file) => {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
}

module.exports = { executeCode };