const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function executeCode(language, code, input = "") {
  return new Promise((resolve) => {
    const id = Date.now();
    const baseDir = __dirname;

    let runCmd;

    if (language === "python") {
      const filePath = path.join(baseDir, `${id}.py`);
      const inputPath = path.join(baseDir, `${id}.txt`);

      fs.writeFileSync(filePath, code);
      fs.writeFileSync(inputPath, input + "\n");

      runCmd = spawn("python3", [filePath]);

      const inputStream = fs.createReadStream(inputPath);
      inputStream.pipe(runCmd.stdin);

      collectOutput(runCmd, resolve, id);
    }

    else if (language === "cpp") {
      const cppPath = path.join(baseDir, `${id}.cpp`);
      const outPath = path.join(baseDir, `${id}.out`);
      const inputPath = path.join(baseDir, `${id}.txt`);

      fs.writeFileSync(cppPath, code);
      fs.writeFileSync(inputPath, input + "\n");

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

        const inputStream = fs.createReadStream(inputPath);
        inputStream.pipe(runCmd.stdin);

        collectOutput(runCmd, resolve, id);
      });

      return;
    }

    else {
      return resolve("Unsupported language");
    }
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
  [".py", ".cpp", ".out", ".txt"].forEach((ext) => {
    const file = path.join(baseDir, `${id}${ext}`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });
}

module.exports = { executeCode };