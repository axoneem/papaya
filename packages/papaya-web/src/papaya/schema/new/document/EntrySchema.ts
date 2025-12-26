import { z } from "zod";

import { ComputedAmountSchema } from "../object/ComputedAmountSchema";
import { EditableAmountSchema } from "../object/EditableAmountSchema";
import { makeDocumentSchema, makePapayaResourceNameSchema } from "../schema-utils";

export const EntrySchema = makeDocumentSchema('papaya:entry', {
  memo: z.string(),
  date: z.iso.date(),
  time: z.iso.time(),
  journalId: makePapayaResourceNameSchema('papaya:journal'),
  sourceAccount: z.templateLiteral(['&', z.string()]).nullable(),
  amount: EditableAmountSchema,
  '@derived': z.object({
    netAmount: ComputedAmountSchema,
  }),
});

export type Entry = z.infer<typeof EntrySchema>;

export const EntryIdentifierSchema = EntrySchema.shape._id;

export type EntryIdentifier = z.infer<typeof EntryIdentifierSchema>;
