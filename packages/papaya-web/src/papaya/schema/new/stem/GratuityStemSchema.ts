import z from "zod";
import { EditableAmountSchema } from "../object/EditableAmountSchema";
import { makeStemSchema } from "../schema-utils";


export const GratuityStemSchema = makeStemSchema('papaya:stem:gratuity', {
  '@ephemeral': z.object({
    value: z.string(),
  }).partial().optional(),
  '@derived': z.object({
    amount: EditableAmountSchema,
    asPercentage: z.number(),
  }),
});
export type GratuityStem = z.infer<typeof GratuityStemSchema>;