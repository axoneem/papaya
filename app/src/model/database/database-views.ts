import { PapayaResource } from "@/model/orm/Repository";
import { OrmDocument } from "@/model/types/orm-types";

declare function emit(key: unknown, value: string): void;

export type PapayaDocument = OrmDocument<PapayaResource>;

export type DatabaseViewRegistry = Record<string, DatabaseView>;

export type DatabaseView = {
  map: (doc: PapayaDocument) => void;
  reduce?: (key: string, values: string[]) => string;
}

export const databaseViews = {
  'journal_entries_by_date': {
    map: function (doc: PapayaDocument) {
      if (doc.kind === 'papaya:journalentry') {
        emit(doc.date, doc._id);
      }
    }
  }
} as const satisfies DatabaseViewRegistry;

export type PapayaDatabaseView = keyof typeof databaseViews;
