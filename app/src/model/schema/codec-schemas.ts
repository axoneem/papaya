import { JOURNAL_ENTRY_DEFAULT_MEMO } from "@/constants/journal-editor-constants";
import { parseMonetaryAmountString, serializeJournalEntryAmount } from "@/utils/money-utils";
import z from "zod";
import { JournalEntryForm, JournalEntryFormSchema } from "./form-schemas";
import { JournalEntry, JournalEntrySchema } from "./resource-schemas";

export const JournalEntryToFormCodec = z.codec(
  JournalEntrySchema.loose(),
  JournalEntryFormSchema,
  {
    decode: (journalEntry: JournalEntry): JournalEntryForm => {
      // console.log('beginning to decode:', journalEntry);
      return {
        '@source': journalEntry,
        memo: journalEntry.memo ?? JOURNAL_ENTRY_DEFAULT_MEMO,
        amountString: serializeJournalEntryAmount(journalEntry.amount),
        topics: journalEntry.topics ?? [],
        date: journalEntry.date,
        time: journalEntry.time,
      };
    },
    encode: (form: JournalEntryForm): JournalEntry => {
      return {
        ...form['@source'],
        date: form.date,
        time: form.time,
        memo: form.memo,
        amount: parseMonetaryAmountString(form.amountString),
        topics: form.topics,
      };
    },
  }
);