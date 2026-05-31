import { DEFAULT_CURRENCY, DEFAULT_JOURNAL_NAME } from "@/constants/config-constants";
import { PREFERENCES_ID } from "@/constants/namespace-constants";
import { Preferences } from "@/model/schema/resource-schemas";
import { OrmDocument } from "@/model/types/orm-types";
import { Repository, ResourceIntrinsic } from "../Repository";

export class PreferencesRepository extends Repository<"Preferences"> {
  constructor() {
    super("Preferences");
  }

  factory = (data: Partial<Preferences>): ResourceIntrinsic<"Preferences"> => {
    const now = new Date().toISOString();
    return {
      _id: PREFERENCES_ID,
      journal: {
        createdAt: now,
        name: DEFAULT_JOURNAL_NAME,
        currency: DEFAULT_CURRENCY,
        notes: '',
        ...(data.journal ?? {}),
      },
    }
  };

  async getPreferences(): Promise<OrmDocument<Preferences> | undefined> {
    const db = await this.getDb();
    return db.get<Preferences>(PREFERENCES_ID)
      .then((result) => {
        return result as OrmDocument<Preferences> | undefined;
      })
      .catch(() => {
        return undefined;
      });
  }

  async getOrCreatePreferences(): Promise<OrmDocument<Preferences>> {
    const existing = await this.getPreferences();
    if (existing) {
      return existing;
    }

    return this.Model.create();
  }
}

export const preferencesRepository = new PreferencesRepository();
