import { Router } from "../deps.ts";
import { addRoutes } from "../router.ts";
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "World!";
});

addRoutes(import.meta.url, router)