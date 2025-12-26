import z from "zod";

export const EditableAmountSchema = z.object({
  currency: z.literal('CAD'),
  '@derived': z.object({
    value: z.number(),
  }),
  '@ephemeral': z.object({
    rawValue: z.string(),
  }),
});

export type EditableAmount = z.infer<typeof EditableAmountSchema>;
