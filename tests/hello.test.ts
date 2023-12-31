import { assertEquals } from "../deps.ts";
import { loadSuperDeno } from "../test-utils.ts";
const superdeno = loadSuperDeno(import.meta.url);

Deno.test({
  name: "GET /hello",
  async fn() {
    await superdeno
      .get("/")
      .expect(200)
      .expect((response) => {
        assertEquals(response.text, "World!");
      });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
