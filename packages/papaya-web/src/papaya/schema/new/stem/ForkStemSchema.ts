import z from "zod";
import { EntryIdentifierSchema, EntrySchema } from "../document/EntrySchema";
import { makeStemSchema } from "../schema-utils";

export const ForkStemSchema = makeStemSchema('papaya:stem:fork', {
  subentries: z.record(EntryIdentifierSchema, EntrySchema)
});
export type ForkStem = z.infer<typeof ForkStemSchema>;