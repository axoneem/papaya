import z from "zod";
import { PersonSchema } from "../document/PersonSchema";
import { makeStemSchema } from "../schema-utils";

export const MentionStemSchema = makeStemSchema('papaya:stem:mention', {
  party: PersonSchema.shape.handle,
});
export type MentionStem = z.infer<typeof MentionStemSchema>;
