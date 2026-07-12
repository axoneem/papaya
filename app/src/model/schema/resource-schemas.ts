
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

export const PoolSchema = createResourceSchema("Pool", {
});

export const JournalEntrySchema = createResourceSchema("JournalEntry", {
  /**
   * The amount of the journal entry
   */
  amount: z.number(),
  /**
   * The date of the journal entry
   */
  date: z.iso.date(),
  /**
   * The memo of the journal entry
   */
  memo: z.string(),
  /**
   * If present, indicates that the amount was originally expressed in a different currency
   */
  convertedFrom: PriceConversionSchema.nullish(),
  /**
   * The account to which the journal entry is credited/debited
   */
  destinationAccount: AccountSlugSchema.nullish(),
  /**
   * Optional notes for the journal entry
   */
  notes: z.string().nullish(),
  /**
   * Optional timestamp representing the date and time the journal entry was posted
   */
  postedAt: z.iso.datetime().nullish(),
  /**
   * The account from which the journal entry is debited
   */
  sourceAccount: AccountSlugSchema.nullish(),
  /**
   * The stamps applied to the journal entry, if any
   */
  stamps: z.array(StampSlugSchema).nullish(),
  /**
   * The time of the journal entry
   */
  time: z.iso.time().nullish(),
  /**
   * The topics to which the journal entry is associated, if any
   */
  topics: z.array(TopicSlugSchema).nullish(),
  /**
   * Ordered lineage from the root ancestor down to the immediate parent.
   * Empty for root journal entries; each child embeds the full ancestry so
   * MapReduce views can roll up values without async parent lookups.
   */
  // path: z.array(JournalEntryRidSchema).default([]),
});

export type Preferences = z.infer<typeof PreferencesSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type JournalEntry = z.infer<typeof JournalEntrySchema>;
