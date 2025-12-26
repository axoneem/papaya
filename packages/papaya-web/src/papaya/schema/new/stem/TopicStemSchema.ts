import z from "zod";
import { makeStemSchema } from "../schema-utils";

export const TopicStemSchema = makeStemSchema('papaya:stem:topic', {
  slug: z.templateLiteral(['#', z.string()]),
});
export type TopicStem = z.infer<typeof TopicStemSchema>;
