import { DEFAULT_CURRENCY } from "@/constants/config-constants";
import type { JournalRid } from "@/model/schema/namespace-schemas";
import { Journal } from "@/model/schema/resource-schemas";
import { OrmDocument } from "@/model/types/orm-types";
import { Repository, ResourceIntrinsic } from "../Repository";

export class JournalRepository extends Repository<"Journal"> {
  constructor() {
    super("Journal");
  }

  factory = (data: Partial<Journal>): ResourceIntrinsic<"Journal"> => {
    const defaultCurrency = DEFAULT_CURRENCY;

    return {
      name: data.name ?? "",
      notes: data.notes ?? "",
      lastOpenedAt: data.lastOpenedAt ?? null,
      currency: data.currency ?? defaultCurrency,
      createdAt: data.createdAt ?? new Date().toISOString(),
    };
  };

  async getJournalByRid(rid: JournalRid): Promise<OrmDocument<Journal> | undefined> {
    try {
      const db = await this.getDb();
      const journal = await db.get<Journal>(rid);
      if (!journal) {
        return undefined;
      }
      return journal;
    } catch {
      return undefined;
    }
  }

  async listAllJournals(): Promise<OrmDocument<Journal>[]> {
    throw new Error("Not implemented");
  }

  async getLastOpened() {
    throw new Error("Not implemented");
  }
}

export const journalRepository = new JournalRepository();
