const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function executeCode(language, code, input = "") {
  return new Promise((resolve) => {
    const id = Date.now();
    const baseDir = __dirname;

    let filePath, runCmd;

    if (language === "python") {
      filePath = path.join(baseDir, `${id}.py`);
      fs.writeFileSync(filePath, code);

      runCmd = spawn("python3", [filePath]);

      runCmd.stdin.write(input);
      runCmd.stdin.end();
    }

    else if (language === "cpp") {
      const cppPath = path.join(baseDir, `${id}.cpp`);
      const outPath = path.join(baseDir, `${id}.out`);

      fs.writeFileSync(cppPath, code);

      const compile = spawn("g++", [cppPath, "-o", outPath]);

      let compileErr = "";

      compile.stderr.on("data", (d) => {
        compileErr += d.toString();
      });

      compile.on("close", (codeExit) => {
        if (codeExit !== 0) {
          cleanup(id);
          return resolve(compileErr || "Compilation error");
        }

        runCmd = spawn(outPath);

        runCmd.stdin.write(input);
        runCmd.stdin.end();

        collectOutput(runCmd, resolve, id);
      });

      return;
    }

    else {
      return resolve("Unsupported language");
    }

    collectOutput(runCmd, resolve, id);
  });
}

function collectOutput(proc, resolve, id) {
  let out = "";
  let err = "";

  proc.stdout.on("data", (d) => (out += d.toString()));
  proc.stderr.on("data", (d) => (err += d.toString()));

  proc.on("close", () => {
    cleanup(id);
    resolve((err || out || "No output").trim());
  });

  setTimeout(() => {
    proc.kill("SIGKILL");
    cleanup(id);
    resolve("Execution timed out (5 seconds)");
  }, 5000);
}

function cleanup(id) {
  const baseDir = __dirname;
  [".py", ".cpp", ".out"].forEach((ext) => {
    const file = path.join(baseDir, `${id}${ext}`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });
}

module.exports = { executeCode };