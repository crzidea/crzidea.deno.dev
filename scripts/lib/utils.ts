export async function generateRouteIndex() {
  const routesDir = "./routes";
  const files = [];
  for await (const file of Deno.readDir(routesDir)) {
    if (file.isFile) {
      files.push(file.name);
    }
  }
  const indexFileContent = files
    .map((file) => `import "${routesDir}/${file}";`)
    .join("\n");
  await Deno.writeTextFile(`${routesDir}-index.ts`, indexFileContent);
}
