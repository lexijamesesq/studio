import { mkdir, writeFile } from "node:fs/promises";
import { z } from "zod";
import { configSchema, discoverySchema, prepareSchema, selectSchema } from "./schema.js";

await mkdir("schemas", { recursive: true });
for (const [name, schema] of Object.entries({
  config: configSchema,
  "discovery-result": discoverySchema,
  selection: selectSchema,
  preparation: prepareSchema,
})) {
  await writeFile(
    `schemas/${name}.schema.json`,
    `${JSON.stringify(z.toJSONSchema(schema, { target: "draft-07" }), null, 2)}\n`,
  );
}
