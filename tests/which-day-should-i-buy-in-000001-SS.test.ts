import { assertExists } from "../deps.ts";
import { loadSuperDeno } from "../test-utils.ts";
const superdeno = loadSuperDeno(import.meta.url);

Deno.test({
  name: "GET /which-day-should-i-buy-in-000001-SS",
  async fn() {
    await superdeno
      .get("/")
      .expect(200)
      .expect((response) => {
        const json = JSON.parse(response.text);
        assertExists(json.latestDate);
        assertExists(json.summaryOfDays);
      });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
