import { Application, oakCors } from "./deps.ts";
import router from "./router.ts";
import "./routes-index.ts"

const application = new Application();
application.use(oakCors()); // Enable CORS for All Routes
application.use(router.routes());
application.use(router.allowedMethods());

const envPort = Deno.env.get("PORT")
export const port = envPort ? parseInt(envPort) : 8000

if (import.meta.main) {
  application.addEventListener("listen", (event) => {
    console.log(`Listening on: http://${event.hostname}:${event.port}`);
  });
  application.listen({ port });
}

export default application;