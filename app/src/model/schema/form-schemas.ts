import { TopicSlugSchema } from "@/model/schema/etc-schemas";
import z from "zod";
import { JournalEntrySchema } from "./resource-schemas";
import { createResourceFormSchema } from "./template-schemas";

export const JournalEntryFormSchema = createResourceFormSchema(
  JournalEntrySchema,
  {
    amountString: z.string(),
    topics: z.array(TopicSlugSchema),
    date: z.iso.date(),
    time: z.iso.time().nullish(),
    memo: z.string().nullish(),
  }
);

export type JournalEntryForm = z.infer<typeof JournalEntryFormSchema>;
