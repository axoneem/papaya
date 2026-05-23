import { JOURNAL_ENTRY_DEFAULT_MEMO } from "@/constants/journal-editor-constants";
import { serializeJournalEntryAmount } from "@/utils/money-utils";
import z from "zod";
import { JournalEntryForm, JournalEntryFormSchema, TransactionForm, TransactionFormSchema } from "./form-schemas";
import { JournalEntry, JournalEntrySchema, Transaction, TransactionSchema } from "./resource-schemas";

export const TransactionToFormCodec = z.codec(
  TransactionSchema,
  TransactionFormSchema,
  {
    decode: (transaction: Transaction): TransactionForm => {
      return {
        '@source': transaction,
        memo: transaction.memo ?? JOURNAL_ENTRY_DEFAULT_MEMO,
        amountString: serializeJournalEntryAmount(transaction.amount),
        topics: transaction.topics ?? [],
        convertedFrom: transaction.convertedFrom,
        date: transaction.date,
        time: transaction.time,
      };
    },
    encode: (form: TransactionForm): Transaction => {
      return {
        ...form['@source'],
        amount: Number(form.amountString),
        topics: form.topics,
        convertedFrom: form.convertedFrom,
        memo: form.memo,
        date: form.date,
        time: form.time,
        sourceAccount: form.sourceAccount,
        destinationAccount: form.destinationAccount,
      };
    },
  }
);

export const JournalEntryToFormCodec = z.codec(
  JournalEntrySchema.loose(),
  JournalEntryFormSchema,
  {
    decode: (journalEntry: JournalEntry): JournalEntryForm => {
      console.log('beginning to decode:', journalEntry);
      return {
        '@source': journalEntry,
        date: journalEntry.date,
        time: journalEntry.time,
        memo: journalEntry.memo,
        transactions: Object.fromEntries(
          Object.entries(journalEntry.transactions).map(([transactionRid, transaction]) => [transactionRid, TransactionToFormCodec.decode(transaction)])),
      };
    },
    encode: (form: JournalEntryForm): JournalEntry => {
      return {
        ...form['@source'],
        date: form.date,
        time: form.time,
        memo: form.memo,
        transactions: Object.fromEntries(
          Object.entries(form.transactions).map(([transactionRid, transaction]) => [transactionRid, TransactionToFormCodec.encode(transaction)])),
      };
    },
  }
);