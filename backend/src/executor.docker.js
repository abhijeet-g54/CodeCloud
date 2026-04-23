const { spawn } = require("child_process");

function executeCode(language, code, input = "") {
  return new Promise((resolve) => {
    let image = "";

    if (language === "python") image = "codecloud-python";
    else if (language === "cpp") image = "codecloud-cpp";
    else return resolve("Unsupported language");

    const args = [
      "run",
      "--rm",
      "-i",
      "--memory=128m",
      "--cpus=0.5",
      "--pids-limit=64",
      "--network=none",
      image
    ];

    const child = spawn("docker", args, {
      stdio: ["pipe", "pipe", "pipe"]
    });

    let output = "";
    let errorOutput = "";

    child.stdin.write(code + "\n" + input + "\n");
    child.stdin.end();

    child.stdout.on("data", (d) => (output += d.toString()));
    child.stderr.on("data", (d) => (errorOutput += d.toString()));

    child.on("close", () => {
      if (errorOutput) return resolve(errorOutput.trim());
      resolve((output || "No output").trim());
    });

    setTimeout(() => {
      child.kill("SIGKILL");
      resolve("Execution timed out (5 seconds)");
    }, 5000);
  });
}

module.exports = { executeCode };