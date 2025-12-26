import { z } from "zod";
import { makeStemSchema } from "../schema-utils";

export const RecurrenceStemSchema = makeStemSchema('papaya:stem:recurrence', {
  '@derived': z.object({
    iCalRruleString: z.string(),
  }),
});
export type RecurrenceStem = z.infer<typeof RecurrenceStemSchema>;
