import { dirname } from "https://deno.land/std@0.152.0/path/mod.ts";
import application from "./main.ts";

const __dirname = dirname(import.meta.url);
const testsDir = `${__dirname}/tests`;
let baseUrl: string;
let applicationStarted = false
const listenPromise = new Promise((resolve) => {
  application.addEventListener("listen", (event) => {
    const { hostname, port } = event;
    baseUrl = `http://${hostname}:${port}`;
    console.log(`Listening on: ${baseUrl}`);
    resolve({ baseUrl, port });
  });
  application.listen();
});

export async function startTest(testFileUrl: string) {
  if (!applicationStarted) {
    await listenPromise;
    applicationStarted = true
  }
  const path = testFileUrl.replace(testsDir, "").replace(".ts", "");
  return function _fetch(subPath: string, options: RequestInit = {}) {
    return fetch(`${baseUrl}${path}${subPath}`, options);
  };
}
