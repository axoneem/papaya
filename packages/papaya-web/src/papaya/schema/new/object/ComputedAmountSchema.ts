import z from "zod";

export const ComputedAmountSchema = z.object({
  currency: z.literal('CAD'),
  value: z.number(),
});

export type ComputedAmount = z.infer<typeof ComputedAmountSchema>;
