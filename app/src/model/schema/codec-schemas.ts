import { JOURNAL_ENTRY_DEFAULT_MEMO } from "@/constants/journal-editor-constants";
import { transactionRepository } from "@/model/orm/repositories";
import { parseMonetaryAmountString, serializeJournalEntryAmount } from "@/utils/money-utils";
import z from "zod";
import { JournalEntryForm, JournalEntryFormSchema } from "./form-schemas";
import { JournalEntry, JournalEntrySchema } from "./resource-schemas";

const getPrimaryTransactionAmount = (journalEntry: JournalEntry): number =>
  journalEntry.transactions[0]?.amount ?? 0;

export const JournalEntryToFormCodec = z.codec(
  JournalEntrySchema.loose(),
  JournalEntryFormSchema,
  {
    decode: (journalEntry: JournalEntry): JournalEntryForm => {
      return {
        '@source': journalEntry,
        memo: journalEntry.memo ?? JOURNAL_ENTRY_DEFAULT_MEMO,
        amountString: serializeJournalEntryAmount(getPrimaryTransactionAmount(journalEntry)),
        topics: journalEntry.topics ?? [],
        date: journalEntry.date,
        time: journalEntry.time,
      };
    },
    encode: (form: JournalEntryForm): JournalEntry => {
      const source = form['@source'];
      const amount = parseMonetaryAmountString(form.amountString) ?? 0;
      const primaryTransaction = source.transactions[0] ?? transactionRepository.Model.make();

      return {
        ...source,
        date: form.date,
        time: form.time,
        memo: form.memo,
        topics: form.topics,
        transactions: [
          {
            ...primaryTransaction,
            amount,
          },
          ...source.transactions.slice(1),
        ],
      };
    },
  }
);