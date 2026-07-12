import { JournalEntrySeeder } from "@/model/database/seeders/JournalEntrySeeder";
import type { JournalEntry } from "@/model/schema/resource-schemas";
import type { OrmDocument } from "@/model/types/orm-types";
import { useEffect } from "react";

declare global {
  interface Window {
    _papaya_database_seeder?: {
      seed: (count?: number) => Promise<OrmDocument<JournalEntry>[]>;
    };
  }
}

export function useDatabaseSeeder() {
  useEffect(() => {
    const journalEntrySeeder = new JournalEntrySeeder();

    window._papaya_database_seeder = {
      seed: (count?: number) => journalEntrySeeder.seed(count),
    };

    return () => {
      delete window._papaya_database_seeder;
    };
  }, []);

  return {
    seed: (count?: number) => window._papaya_database_seeder?.seed(count),
  };
}
