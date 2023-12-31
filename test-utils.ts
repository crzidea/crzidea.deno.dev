import application from "./main.ts";
import { dirname, superoak } from "./deps.ts";

const __dirname = dirname(import.meta.url);
const testsDir = `${__dirname}/tests`;
const superdeno = await superoak(application);

export function loadSuperDeno(testFileUrl: string) {
  const routePath = testFileUrl.replace(testsDir, "").replace(".test.ts", "");
  return new Proxy(superdeno, {
    get(target, prop) {
      const value = target[prop as keyof typeof target];
      if(!(prop in target)) {
        return value
      }
      if ("function" === typeof value) {
        return (subPath: string) => {
          return value(`${routePath}${subPath}`);
        };
      }
    }
  })
}
