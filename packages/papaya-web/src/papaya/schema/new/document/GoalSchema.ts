import { z } from "zod";
import { EditableAmountSchema } from "../object/EditableAmountSchema";
import { makeDocumentSchema } from "../schema-utils";
import { EntryIdentifierSchema } from "./EntrySchema";

export const GoalSchema = makeDocumentSchema('papaya:goal', {
  title: z.string(),
  description: z.string(),
  target: EditableAmountSchema,
  deadline: z.iso.date().nullable(),
  '@derived': z.object({
    /**
     * Amount saved/spent so far
     */
    net: EditableAmountSchema,
    contributions: z.array(EntryIdentifierSchema),
    progress: z.number().min(0).max(1),
  }),
});
export type Goal = z.infer<typeof GoalSchema>;