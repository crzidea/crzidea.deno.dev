import { dirname } from "https://deno.land/std@0.152.0/path/mod.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
const router = new Router();
const __dirname = dirname(import.meta.url);
const routesDir = `${__dirname}/routes`

export function addRoutes(module: string, moduleRouter: Router) {
  const path = module.replace(routesDir, "").replace(".ts", "");
  router.use(path, moduleRouter.routes(), moduleRouter.allowedMethods());
}

export default router