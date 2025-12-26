import z from "zod";
import { makeResourceSchema, makeStemSchema } from "../schema-utils";

export const TaskSchema = makeResourceSchema('papaya:task', {
  memo: z.string(),
  completedAt: z.iso.date().nullable(),
});

export const TaskListStemSchema = makeStemSchema('papaya:stem:tasklist', {
  tasks: z.array(TaskSchema),
});
export type TaskListStem = z.infer<typeof TaskListStemSchema>;
