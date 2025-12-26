import z from "zod";
import { makeStemSchema } from "../schema-utils";

export const AttachmentStemSchema = makeStemSchema('papaya:stem:attachment', {
  originalFileName: z.string(),
  contentType: z.string(),
  size: z.number(),
  description: z.string(),
});
export type AttachmentStem = z.infer<typeof AttachmentStemSchema>;
