import z from "zod";
import { makeStemSchema } from "../schema-utils";

export const NoteStemSchema = makeStemSchema('papaya:stem:note', {
  content: z.string(),
});
export type NoteStem = z.infer<typeof NoteStemSchema>;
