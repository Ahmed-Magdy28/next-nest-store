import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

function getEnvConfig() {
  let port = process.env.Frontend_PORT || process.env.FRONTEND_PORT || process.env.PORT || "";
  let defaultLocale = process.env.DEFAULT_LOCALE || "";

  const candidatePaths = [
    resolve(__dirname, "../../../.env"),
    resolve(process.cwd(), "../../.env"),
    resolve(process.cwd(), ".env"),
  ];

  for (const envPath of candidatePaths) {
    if (existsSync(envPath)) {
      try {
        const content = readFileSync(envPath, "utf8");
        if (!port) {
          const matchPort = content.match(/^(?:Frontend_PORT|FRONTEND_PORT|PORT)=(.*)$/m);
          if (matchPort && matchPort[1]) {
            port = matchPort[1].replace(/["'\r]/g, "").trim();
          }
        }
        if (!defaultLocale) {
          const matchLocale = content.match(/^DEFAULT_LOCALE=(.*)$/m);
          if (matchLocale && matchLocale[1]) {
            defaultLocale = matchLocale[1].replace(/["'\r]/g, "").trim();
          }
        }
      } catch {
        // continue
      }
    }
  }

  return {
    port: port || "4000",
    defaultLocale: defaultLocale || "en",
  };
}

const { port, defaultLocale } = getEnvConfig();
const command = process.argv[2] || "dev";
const nextBin = require.resolve("next/dist/bin/next");
const extraArgs = process.argv.slice(3);
const appDir = resolve(__dirname, "..");

const child = spawn(process.execPath, [nextBin, command, "--port", port, ...extraArgs], {
  stdio: "inherit",
  cwd: appDir,
  env: {
    ...process.env,
    PORT: port,
    DEFAULT_LOCALE: defaultLocale,
    NEXT_PUBLIC_DEFAULT_LOCALE: defaultLocale,
  },
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
