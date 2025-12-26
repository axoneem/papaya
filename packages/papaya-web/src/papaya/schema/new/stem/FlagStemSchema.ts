import z from "zod";
import { makeStemSchema } from "../schema-utils";

const FlagTypeSchema = z.enum([
  'IMPORTANT',
  'NEEDS_REVIEW',
  'REVIEWED',
]);

export const FlagStemSchema = makeStemSchema('papaya:stem:flag', {
  flags: z.record(FlagTypeSchema, z.boolean()),
});
export type FlagStem = z.infer<typeof FlagStemSchema>;
