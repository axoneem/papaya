import z from "zod";
import { makeDocumentSchema } from "../schema-utils";

export const PersonSchema = makeDocumentSchema('papaya:person', {
  name: z.string(),
  handle: z.templateLiteral(['@', z.string()]),
});
export type Person = z.infer<typeof PersonSchema>;