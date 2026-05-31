
import { PREFERENCES_ID } from "@/constants/namespace-constants";
import {
  createResourceSchema
} from "@/model/schema/template-schemas";
import z from "zod";
import { CurrencyIso4217Schema, PictogramSchema, PriceConversionSchema } from "./etc-schemas";
import { JournalEntryRidSchema, TransactionRidSchema } from "./namespace-schemas";
import {
  PersonSlugSchema
} from "./string-schemas";

export const PreferencesSchema = createResourceSchema("Preferences", {
  _id: z.literal(PREFERENCES_ID),
  journal: z.object({
    /**
     * The name for the journal
     */
    name: z.string(),
    /**
     * Optional notes for the journal
     */
    notes: z.string(),
    /**
     * The currency used to express monetary values in the journal. Other currencies
     * can be used, but the journal maintains monetary values in a single currency.
     */
    currency: CurrencyIso4217Schema,
    /**
     * The date and time the journal was created
     */
    createdAt: z.iso.datetime(),
  }),
});

export const PersonSchema = createResourceSchema("Person", {
  slug: PersonSlugSchema,
  nickname: z.string(),
  icon: PictogramSchema.nullish(),
});

export const TaskSchema = createResourceSchema("Task", {
  memo: z.string(),
  completedAt: z.iso.date().nullable(),
});

export const TransactionSchema = createResourceSchema("Transaction", {
  parent: JournalEntryRidSchema.nullable(),
  memo: z.string(),
  amount: z.number(),
  convertedFrom: PriceConversionSchema.nullish(),
  date: z.iso.date().nullish(),
  time: z.iso.time().nullish(),
  sourceAccount: z.string().nullish(),
  destinationAccount: z.string().nullish(),
  topics: z.array(z.string()).nullish(),
});

export const JournalEntrySchema = createResourceSchema("JournalEntry", {
  transactions: z.record(TransactionRidSchema, TransactionSchema),
  memo: z.string().nullish(),
  date: z.iso.date(),
  time: z.iso.time().nullish(),
});

export type Preferences = z.infer<typeof PreferencesSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type JournalEntry = z.infer<typeof JournalEntrySchema>;
