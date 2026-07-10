import { PapayaResourceNamespace } from "@/model/schema/namespace-schemas";
import {
  JournalEntrySchema,
  PersonSchema,
  PoolSchema,
  PreferencesSchema,
  TaskSchema,
} from "@/model/schema/resource-schemas";
import { ResourceSchema } from "@/model/schema/template-schemas";

export const ResourceSchemaRegistry = {
  JournalEntry: JournalEntrySchema,
  Preferences: PreferencesSchema,
  Person: PersonSchema,
  Pool: PoolSchema,
  Task: TaskSchema,
} as const satisfies {
  [N in PapayaResourceNamespace]: ResourceSchema<N>
};
