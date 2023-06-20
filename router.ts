import { Router, dirname } from "./deps.ts";

const router = new Router();
const __dirname = dirname(import.meta.url);
const routesDir = `${__dirname}/routes`

export function addRoutes(module: string, moduleRouter: Router) {
  const path = module.replace(routesDir, "").replace(".ts", "");
  router.use(path, moduleRouter.routes(), moduleRouter.allowedMethods());
}

export default router