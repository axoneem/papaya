import z from "zod";
import { PersonSchema } from "../document/PersonSchema";
import { makeStemSchema } from "../schema-utils";

export const ObligationStemSchema = makeStemSchema('papaya:stem:obligation', {
  variant: z.enum(['DEBT', 'PAYABLE']),
  party: PersonSchema.shape.handle,
});
export type ObligationStem = z.infer<typeof ObligationStemSchema>;
