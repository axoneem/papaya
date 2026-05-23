import type { JournalEntryRid, JournalRid, TransactionRid } from "@/model/schema/namespace-schemas";
import { JournalEntry, Transaction } from "@/model/schema/resource-schemas";
import { OrmDocument } from "@/model/types/orm-types";
import { getToday } from "@/utils/date-utils";
import { Repository, ResourceIntrinsic } from "../Repository";
import { TransactionRepository } from "./TransactionRepository";

export class JournalEntryRepository extends Repository<"JournalEntry"> {
  private transactionRepository: TransactionRepository;

  constructor() {
    super("JournalEntry");
    this.transactionRepository = new TransactionRepository();
  }

  private makeTransaction(entryRid: JournalEntryRid): Transaction {
    return this.transactionRepository.Model.make({
      parent: entryRid,
    });
  }

  // TODO remove, all documents will call timestamp() in the Repository.save() method
  // beforeSave = async (data: JournalEntry & Partial<OrmDocument>): Promise<JournalEntry & Partial<OrmDocument>> => {
  //   alert('before save');
  //   return timestamp(data);
  // }

  factory = (data: Partial<JournalEntry>): ResourceIntrinsic<"JournalEntry"> => {
    const rid: JournalEntryRid = data.rid ?? this.makeRid();

    let transactions: Record<TransactionRid, Transaction>;

    if (data.transactions) {
      transactions = data.transactions;
    } else {
      const transaction = this.makeTransaction(rid);
      transactions = {
        [transaction.rid]: transaction,
      };
    }

    return {
      journalRid: data.journalRid!,
      rid,
      date: data.date ?? getToday(),
      transactions,
    };
  };

  public async getJournalEntriesByDate(
    journalRid: JournalRid,
    startDate: Date | string | null = undefined,
    endDate: Date | string | null = undefined,
  ): Promise<OrmDocument<JournalEntry>[]> {
    const db = await this.getDb();
    const toDateKey = (value: Date | string | null | undefined): string | null => {
      if (value == null) {
        return null;
      }
      if (typeof value === "string") {
        return value;
      }
      return value.toISOString().slice(0, 10);
    };

    const startDateKey = toDateKey(startDate) ?? "";
    const endDateKey = toDateKey(endDate) ?? "\ufff0";

    try {
      const result = await db.query('papaya/journal_entries_by_date', {
        startkey: [journalRid, startDateKey],
        endkey: [journalRid, endDateKey],
        include_docs: true,
      });

      return result.rows
        .map((row) => row.doc as OrmDocument<JournalEntry> | undefined)
        .filter((doc): doc is OrmDocument<JournalEntry> => !!doc);
    } catch (err) {
      console.error('error querying journal entries by date: ', err);
      return [];
    }
  }
}

export const journalEntryRepository = new JournalEntryRepository();
