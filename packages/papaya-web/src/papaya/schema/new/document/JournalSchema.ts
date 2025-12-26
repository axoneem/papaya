import z from "zod";
import { makeDocumentSchema } from "../schema-utils";

export const JournalSchema = makeDocumentSchema('papaya:journal', {
  name: z.string(),
  notes: z.string(),
  lastOpenedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});
export type Journal = z.infer<typeof JournalSchema>;
