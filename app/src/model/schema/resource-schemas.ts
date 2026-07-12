
import { PREFERENCES_ID } from "@/constants/namespace-constants";
import {
  createResourceSchema
} from "@/model/schema/template-schemas";
import z from "zod";
import { AccountSlugSchema, CurrencyIso4217Schema, PersonSlugSchema, PictogramSchema, PriceConversionSchema, StampSlugSchema, TopicSlugSchema } from "./etc-schemas";

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
  /**
   * The amount of the transaction
   */
  amount: z.number(),
  /**
   * Optional timestamp representing the date and time the transaction was posted
   */
  postedAt: z.iso.datetime().nullish(),
  /**
   * The account from which the transaction is debited
   */
  sourceAccount: AccountSlugSchema.nullish(),
  /**
   * The memo of the transaction
   */
  memo: z.string(),
  /**
   * If present, indicates that the amount was originally expressed in a different currency
   */
  convertedFrom: PriceConversionSchema.nullish(),
  /**
   * The account to which the transaction is credited/debited
   */
  destinationAccount: AccountSlugSchema.nullish(),
});

export const JournalEntrySchema = createResourceSchema("JournalEntry", {
  /**
   * The date of the journal entry
   */
  date: z.iso.date(),
  /**
   * The time of the journal entry
   */
  time: z.iso.time().nullish(),
  /**
   * The memo of the journal entry. If not provided, the first transaction's memo is used.
   */
  memo: z.string().nullish(),
  /**
   * Optional notes for the journal entry
   */
  notes: z.string().nullish(),
  /**
   * The stamps applied to the journal entry, if any
   */
  stamps: z.array(StampSlugSchema).nullish(),
  /**
   * The topics to which the journal entry is associated, if any
   */
  topics: z.array(TopicSlugSchema).nullish(),
  /**
   * The set of transactions that comprise the journal entry
   */
  transactions: z.array(TransactionSchema)
});

export type Preferences = z.infer<typeof PreferencesSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type JournalEntry = z.infer<typeof JournalEntrySchema>;
