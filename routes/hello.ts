import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { addRoutes } from "../router.ts";
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "World!";
});

addRoutes(import.meta.url, router)