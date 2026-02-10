import { spawn } from "child_process";
import { readFile } from "fs/promises";

/**
 * Cross-runtime utilities (Bun + Node.js compatible)
 */

export async function spawnCommand(
  command: string[],
  options: { stdout?: "pipe"; stderr?: "pipe" } = {}
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command[0], command.slice(1), {
      stdio: ["ignore", options.stdout === "pipe" ? "pipe" : "inherit", options.stderr === "pipe" ? "pipe" : "inherit"],
    });

    let stdout = "";
    let stderr = "";

    if (proc.stdout) {
      proc.stdout.on("data", (data) => {
        stdout += data.toString();
      });
    }

    if (proc.stderr) {
      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });
    }

    proc.on("close", (code) => {
      resolve({ stdout, stderr, exitCode: code || 0 });
    });

    proc.on("error", (err) => {
      reject(err);
    });
  });
}

export async function readTextFile(path: string): Promise<string> {
  return await readFile(path, "utf-8");
}
