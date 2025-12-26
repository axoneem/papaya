
import z from "zod";
import { makeDocumentSchema } from "../schema-utils";

export const AccountSchema = makeDocumentSchema('papaya:account', {
  name: z.string(),
  slug: z.templateLiteral(['&', z.string()]),
});
export type Account = z.infer<typeof AccountSchema>;
