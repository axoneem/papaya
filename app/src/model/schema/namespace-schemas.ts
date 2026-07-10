import z from "zod";

export const PapayaResourceNamespaceSchema = z.enum([
  "JournalEntry",
  "Pool",
  "Preferences",
  "Person",
  "Task",
] as const);

export const ridSchemaFromNamespace = <N extends PapayaResourceNamespace>(
  ns: N
) => {
  return z.templateLiteral([kindSchemaFromNamespace(ns), ":", z.uuid()]) as z.ZodTemplateLiteral<PapayaResourceRid<N>>;
};

export const kindSchemaFromNamespace = <N extends PapayaResourceNamespace>(ns: N) => {
  return z.literal(`papaya:${ns.toLowerCase()}`) as z.ZodLiteral<PapayaResourceKind<N>>;
};

const ResourceRidRegistry = Object.fromEntries(
  PapayaResourceNamespaceSchema.options.map((ns) => [
    `${ns}RidSchema`,
    ridSchemaFromNamespace(ns),
  ])
) as {
    [N in PapayaResourceNamespace as `${N}RidSchema`]:
    z.ZodTemplateLiteral<PapayaResourceRid<N>>;
  };

export const {
  JournalEntryRidSchema,
  PoolRidSchema,
  PreferencesRidSchema,
  PersonRidSchema,
  TaskRidSchema,
} = ResourceRidRegistry;

export const PapayaResourceRidSchema = z.union(Object.values(ResourceRidRegistry));

export type PapayaResourceNamespace = z.infer<typeof PapayaResourceNamespaceSchema>;
export type PapayaResourceKind<N extends PapayaResourceNamespace> = `papaya:${Lowercase<N>}`;
export type PapayaResourceRid<N extends PapayaResourceNamespace> = `${PapayaResourceKind<N>}:${string}`;

export type JournalEntryRid = z.infer<typeof JournalEntryRidSchema>;
export type PoolRid = z.infer<typeof PoolRidSchema>;
export type PersonRid = z.infer<typeof PersonRidSchema>;
export type TaskRid = z.infer<typeof TaskRidSchema>;
export type PreferencesRid = z.infer<typeof PreferencesRidSchema>;
