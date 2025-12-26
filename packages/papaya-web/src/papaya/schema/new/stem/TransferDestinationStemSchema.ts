import z from "zod";
import { AccountSchema } from "../document/AccountSchema";
import { makeStemSchema } from "../schema-utils";

export const TransferDestinationStemSchema = makeStemSchema('papaya:stem:transferdestination', {
  destinationAccount: AccountSchema.shape.slug,
});
export type TransferDestinationStem = z.infer<typeof TransferDestinationStemSchema>;
