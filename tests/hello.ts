import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

Deno.test({
  name: "GET /hello",
  async fn() {
    const res = await fetch("http://localhost:8000/hello");
    const body = await res.text();
    assertEquals(body, "World!");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});