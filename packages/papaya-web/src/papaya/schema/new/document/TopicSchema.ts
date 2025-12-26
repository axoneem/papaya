import z from "zod";
import { makeDocumentSchema } from "../schema-utils";

export const TopicSchema = makeDocumentSchema('papaya:topic', {
  name: z.string(),
  slug: z.templateLiteral(['#', z.string()]),
});
export type Topic = z.infer<typeof TopicSchema>;
