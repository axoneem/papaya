import { DEFAULT_CURRENCY } from "@/constants/config-constants";
import { PREFERENCES_ID } from "@/constants/namespace-constants";
import { Preferences } from "@/model/schema/resource-schemas";
import { OrmDocument } from "@/model/types/orm-types";
import { Repository, ResourceIntrinsic } from "../Repository";
import { journalRepository } from "./JournalRepository";

export class PreferencesRepository extends Repository<"Preferences"> {
  constructor() {
    super("Preferences");
  }

  factory = (data: Partial<Preferences>): ResourceIntrinsic<"Preferences"> => {
    return {
      _id: PREFERENCES_ID,
      journal: data.journal ?? {
        selection: "LAST_OPENED",
        defaults: {
          defaultJournalRid: undefined,
        },
      },
    }
  };

  async getPreferences(): Promise<OrmDocument<Preferences> | undefined> {
    const db = await this.getDb();
    const result = await db.get<Preferences>(PREFERENCES_ID);
    return result as OrmDocument<Preferences> | undefined;
  }

  async getOrCreatePreferences(): Promise<OrmDocument<Preferences>> {
    const existing = await this.getPreferences();
    if (existing) {
      return existing;
    }

    const defaultJournal = await journalRepository.Model.create({
      name: "Default Journal",
      currency: DEFAULT_CURRENCY,
    });

    return this.Model.create({
      journal: {
        selection: "DEFAULT_JOURNAL_ELSE_PROMPT",
        defaults: {
          defaultJournalRid: defaultJournal.rid,
        },
      },
    });
  }
}

export const preferencesRepository = new PreferencesRepository();
