import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { startTest } from "../test-utils.ts";

const fetch = await startTest(import.meta.url);

Deno.test({
  name: "GET /world",
  async fn() {
    const res = await fetch("/");
    const body = await res.text();
    assertEquals(body, "Hello!");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});