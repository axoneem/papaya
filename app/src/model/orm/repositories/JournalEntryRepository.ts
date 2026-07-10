import type { JournalEntryRid } from "@/model/schema/namespace-schemas";
import { JournalEntry } from "@/model/schema/resource-schemas";
import { OrmDocument } from "@/model/types/orm-types";
import { getToday } from "@/utils/date-utils";
import { Repository, ResourceIntrinsic } from "../Repository";

export class JournalEntryRepository extends Repository<"JournalEntry"> {
  constructor() {
    super("JournalEntry");
  }

  factory = (data: Partial<JournalEntry>): ResourceIntrinsic<"JournalEntry"> => {
    const rid: JournalEntryRid = data.rid ?? this.makeRid();

    return {
      rid,
      date: data.date ?? getToday(),
      amount: data.amount ?? 0,
      topics: data.topics ?? [],
      memo: data.memo ?? '',
    };
  };

  public async getJournalEntriesByDate(
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
        startkey: startDateKey,
        endkey: endDateKey,
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
