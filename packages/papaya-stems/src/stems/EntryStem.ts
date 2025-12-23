import z from "zod";
import { Stem } from "../Stem";

const AmountSchema = z.object(); // TODO

const BaseStemSchema = z.object({
  kind: z.templateLiteral(['papaya:stem:', z.string()]),
  memo: z.string().nullable(),
  description: z.string().nullable(),
})

const EntryStemSchema = BaseStemSchema.extend({
  kind: z.literal('papaya:steam:entry'),
  amount: AmountSchema,
})

export class EntryStem extends Stem {
  public readonly kind = 'papaya:stem:entry' as const;

  constructor() {
    super();
  }

}
